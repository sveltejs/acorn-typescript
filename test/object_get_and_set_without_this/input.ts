const test = {
    privateName: 'tyreal',
    get name() {
        return this.privateName
    },
    set name(_name: string) {
        this.privateName = _name
    }
}