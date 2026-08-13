import { describe, expect, it } from 'vitest';
import { ParseEffects } from '../src/effects';

function createEffects() {
	const output: string[] = [];
	const options = {
		onToken: (value: string) => output.push(value)
	};
	const effects = new ParseEffects(options);

	return {
		effects,
		emit: (value: string) => options.onToken(value),
		output
	};
}

describe('parse effects', () => {
	it('makes state changes visible inside a checkpoint and rolls them back', () => {
		const { effects } = createEffects();
		const state = { value: 'initial' };
		const frame = effects.begin();

		effects.set(state, 'value', 'speculative');
		expect(state.value).toBe('speculative');

		effects.rollback(frame);
		expect(state.value).toBe('initial');
	});

	it('restores checkpoint state after undoing recorded effects', () => {
		let cursor = 'initial';
		const effects = new ParseEffects(
			{},
			{
				capture: () => cursor,
				restore: (state) => {
					cursor = state;
				}
			}
		);
		const values: string[] = [];
		const frame = effects.begin();

		effects.append(values, 'speculative');
		cursor = 'speculative';
		effects.rollback(frame);

		expect(values).toEqual([]);
		expect(cursor).toBe('initial');
	});

	it('keeps an inner commit rollback-able by its parent', () => {
		const { effects } = createEffects();
		const values: string[] = [];
		const outer = effects.begin();
		effects.append(values, 'outer');
		const inner = effects.begin();
		effects.append(values, 'inner');

		effects.commit(inner);
		expect(values).toEqual(['outer', 'inner']);

		effects.rollback(outer);
		expect(values).toEqual([]);
	});

	it('rolls back an inner checkpoint without discarding its parent mutation', () => {
		const { effects } = createEffects();
		const values: string[] = [];
		const outer = effects.begin();
		effects.append(values, 'outer');
		const inner = effects.begin();
		effects.append(values, 'inner');

		effects.rollback(inner);
		expect(values).toEqual(['outer']);

		effects.commit(outer);
		expect(values).toEqual(['outer']);
	});

	it('delays nested output and preserves commit order', () => {
		const { effects, emit, output } = createEffects();
		const outer = effects.begin();
		emit('outer-before');
		const inner = effects.begin();
		emit('inner');
		effects.commit(inner);
		emit('outer-after');

		expect(output).toEqual([]);
		effects.commit(outer);
		expect(output).toEqual(['outer-before', 'inner', 'outer-after']);
	});

	it('can replay the selected output of a rolled-back branch', () => {
		const { effects, emit, output } = createEffects();
		const outer = effects.begin();
		emit('outer');
		const failed = effects.begin();
		emit('selected-failure');
		const failedEvents = effects.rollbackWithEvents(failed);

		expect(output).toEqual([]);
		effects.replay(failedEvents);
		effects.commit(outer);

		expect(output).toEqual(['outer', 'selected-failure']);
	});

	it('commits deeply nested output exactly once', () => {
		const { effects, emit, output } = createEffects();
		const frames = [effects.begin()];

		for (let i = 0; i < 1_000; i++) {
			frames.push(effects.begin());
			emit(String(i));
		}

		for (let i = frames.length - 1; i >= 0; i--) {
			effects.commit(frames[i]);
		}

		expect(output).toHaveLength(1_000);
		expect(output[0]).toBe('0');
		expect(output.at(-1)).toBe('999');
	});
});
