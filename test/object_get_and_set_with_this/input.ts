const test = {
    privateName: 'tyreal',
    get name(this) {
        return this.privateName
    },
    set name(this, _name) {
        this.privateName = _name
    }
}