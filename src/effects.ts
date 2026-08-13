const parserCallbackNames = [
	'onToken',
	'onComment',
	'onInsertedSemicolon',
	'onTrailingComma'
] as const;

type ParserCallbackName = (typeof parserCallbackNames)[number];
type ParserCallback = (...args: any[]) => unknown;

type ParserCallbackEvent = {
	readonly name: ParserCallbackName;
	readonly args: any[];
};

type ParserOutputSegment = ParserCallbackEvent[] | BufferedParserEvents;

export type BufferedParserEvents = {
	readonly _tag: 'BufferedParserEvents';
	readonly segments: ParserOutputSegment[];
};

export type ParseEffectState<State> = {
	capture(): State;
	restore(state: State): void;
};

export type ParseEffectFrame<State = unknown> = {
	readonly _tag: 'ParseEffectFrame';
	readonly depth: number;
	readonly undoMark: number;
	readonly checkpoint: State | undefined;
	output?: BufferedParserEvents;
};

type UndoEntry =
	| {
			readonly _tag: 'ArrayLength';
			readonly target: any[];
			readonly length: number;
	  }
	| {
			readonly _tag: 'ArrayTail';
			readonly target: any[];
			readonly start: number;
			readonly values: any[];
	  }
	| {
			readonly _tag: 'Property';
			readonly target: Record<PropertyKey, any>;
			readonly key: PropertyKey;
			readonly had: boolean;
			readonly value: any;
	  };

function makeOutputBuffer(): BufferedParserEvents {
	return {
		_tag: 'BufferedParserEvents',
		segments: []
	};
}

const emptyOutputBuffer = makeOutputBuffer();

function hasEvents(output: BufferedParserEvents): boolean {
	return output.segments.length > 0;
}

/**
 * Executes parser-internal mutations eagerly while retaining their inverse,
 * and delays externally observable parser callbacks until the outermost
 * speculative parse commits.
 */
export class ParseEffects<State = unknown> {
	private readonly callbacks: Partial<Record<ParserCallbackName, ParserCallback>> = {};
	private readonly callbackWrappers: Partial<Record<ParserCallbackName, ParserCallback>> = {};
	private readonly frames: ParseEffectFrame<State>[] = [];
	private readonly undoLog: UndoEntry[] = [];
	private readonly hasCallbacks: boolean;

	constructor(
		private readonly options: Record<string, any>,
		private readonly state?: ParseEffectState<State>
	) {
		this.hasCallbacks = this.captureCallbacks();
	}

	get active(): boolean {
		return this.frames.length > 0;
	}

	begin(): ParseEffectFrame<State> {
		const frame: ParseEffectFrame<State> = {
			_tag: 'ParseEffectFrame',
			depth: this.frames.length,
			undoMark: this.undoLog.length,
			checkpoint: this.state?.capture()
		};

		this.frames.push(frame);
		if (frame.depth === 0 && this.hasCallbacks) {
			this.activateCallbacks();
		}
		return frame;
	}

	commit(frame: ParseEffectFrame<State>): void {
		this.close(frame);

		const parent = this.currentFrame();
		if (parent) {
			if (frame.output) {
				this.appendOutput(this.outputFor(parent), frame.output);
			}
			return;
		}

		this.undoLog.length = frame.undoMark;
		if (frame.output) {
			this.flush(frame.output);
		}
	}

	rollback(frame: ParseEffectFrame<State>): void {
		this.close(frame);
		this.unwind(frame.undoMark);
		this.restore(frame);
	}

	rollbackWithEvents(frame: ParseEffectFrame<State>): BufferedParserEvents {
		this.close(frame);
		this.unwind(frame.undoMark);
		this.restore(frame);
		return frame.output ?? emptyOutputBuffer;
	}

	replay(events: BufferedParserEvents): void {
		if (!hasEvents(events)) return;

		const frame = this.currentFrame();
		if (frame) {
			this.appendOutput(this.outputFor(frame), events);
			return;
		}

		this.flush(events);
	}

	set<T extends object, K extends keyof T>(target: T, key: K, value: T[K]): void {
		this.willSet(target, key);
		target[key] = value;
	}

	remove(target: object, key: PropertyKey): void {
		this.willSet(target, key);
		delete (target as Record<PropertyKey, any>)[key];
	}

	append<T>(target: T[], value: T): void {
		this.willAppend(target);
		target.push(value);
	}

	pop<T>(target: T[]): T | undefined {
		this.willMutateTail(target, 1);
		return target.pop();
	}

	truncate<T>(target: T[], length: number): void {
		if (length < target.length) {
			this.willMutateTail(target, target.length - length);
		} else {
			this.willAppend(target);
		}
		target.length = length;
	}

	modify<T extends object, K extends keyof T, A>(
		target: T,
		key: K,
		f: (current: T[K]) => readonly [result: A, next: T[K]]
	): A {
		const [result, next] = f(target[key]);
		this.set(target, key, next);
		return result;
	}

	/**
	 * Compatibility write barriers for mutations performed by inherited Acorn
	 * methods. New plugin-owned mutations should prefer the active operations
	 * above.
	 */
	willAppend(target: any[]): void {
		if (!this.active) return;
		this.undoLog.push({
			_tag: 'ArrayLength',
			target,
			length: target.length
		});
	}

	willMutateTail(target: any[], count: number): void {
		if (!this.active) return;

		const start = Math.max(0, target.length - count);
		this.undoLog.push({
			_tag: 'ArrayTail',
			target,
			start,
			values: target.slice(start)
		});
	}

	willSet(target: object, key: PropertyKey): void {
		if (!this.active) return;

		const record = target as Record<PropertyKey, any>;
		this.undoLog.push({
			_tag: 'Property',
			target: record,
			key,
			had: Object.prototype.hasOwnProperty.call(record, key),
			value: record[key]
		});
	}

	private captureCallbacks(): boolean {
		let captured = false;

		for (const name of parserCallbackNames) {
			const callback = this.options[name] as ParserCallback | undefined;
			if (!callback) continue;

			captured = true;
			this.callbacks[name] = callback;
			this.callbackWrappers[name] = (...args: any[]) => {
				this.emit({
					name,
					args
				});
			};
		}

		return captured;
	}

	private activateCallbacks(): void {
		for (const name of parserCallbackNames) {
			const callback = this.callbackWrappers[name];
			if (callback) {
				this.options[name] = callback;
			}
		}
	}

	private deactivateCallbacks(): void {
		for (const name of parserCallbackNames) {
			const callback = this.callbacks[name];
			if (callback) {
				this.options[name] = callback;
			}
		}
	}

	private emit(event: ParserCallbackEvent): void {
		const frame = this.currentFrame();
		if (!frame) {
			this.invoke(event);
			return;
		}

		const segments = this.outputFor(frame).segments;
		const tail = segments[segments.length - 1];
		if (Array.isArray(tail)) {
			tail.push(event);
		} else {
			segments.push([event]);
		}
	}

	private appendOutput(target: BufferedParserEvents, output: BufferedParserEvents): void {
		if (hasEvents(output)) {
			target.segments.push(output);
		}
	}

	private outputFor(frame: ParseEffectFrame<State>): BufferedParserEvents {
		return (frame.output ??= makeOutputBuffer());
	}

	private flush(output: BufferedParserEvents): void {
		const work: ParserOutputSegment[] = [];

		for (let i = output.segments.length - 1; i >= 0; i--) {
			work.push(output.segments[i]);
		}

		while (work.length > 0) {
			const segment = work.pop()!;
			if (Array.isArray(segment)) {
				for (const event of segment) {
					this.invoke(event);
				}
				continue;
			}

			for (let i = segment.segments.length - 1; i >= 0; i--) {
				work.push(segment.segments[i]);
			}
		}
	}

	private invoke(event: ParserCallbackEvent): void {
		const callback = this.callbacks[event.name];
		callback?.apply(this.options, event.args);
	}

	private currentFrame(): ParseEffectFrame<State> | undefined {
		return this.frames[this.frames.length - 1];
	}

	private close(frame: ParseEffectFrame<State>): void {
		if (this.currentFrame() !== frame || frame.depth !== this.frames.length - 1) {
			throw new Error('Parse effect scopes must be closed in order');
		}

		this.frames.pop();
		if (this.frames.length === 0 && this.hasCallbacks) {
			this.deactivateCallbacks();
		}
	}

	private restore(frame: ParseEffectFrame<State>): void {
		if (this.state) {
			this.state.restore(frame.checkpoint as State);
		}
	}

	private unwind(mark: number): void {
		for (let i = this.undoLog.length - 1; i >= mark; i--) {
			const entry = this.undoLog[i];

			switch (entry._tag) {
				case 'ArrayLength':
					if (entry.target.length < entry.length) {
						throw new Error('A parse effect shortened an append-only array');
					}
					entry.target.length = entry.length;
					break;
				case 'ArrayTail':
					entry.target.length = entry.start;
					for (const value of entry.values) {
						entry.target.push(value);
					}
					break;
				case 'Property':
					if (entry.had) {
						entry.target[entry.key] = entry.value;
					} else {
						delete entry.target[entry.key];
					}
					break;
			}
		}

		this.undoLog.length = mark;
	}
}
