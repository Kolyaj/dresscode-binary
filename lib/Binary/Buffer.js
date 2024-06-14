Binary.Buffer = Bricks.inherit({
    _abcCache: {},

    constructor: function(value, abc) {
        value = value || '';
        abc = abc || Binary.abc;
        if (typeof value !== 'string') {
            throw new TypeError('value must be a string.');
        }
        if (typeof abc !== 'string' || abc.length !== 64) {
            throw new TypeError('abc must be a string of 64 chars.');
        }
        if (!this._abcCache[abc]) {
            this._abcCache[abc] = {
                abc: abc.split(''),
                cba: {}
            };
            var cache = this._abcCache[abc];
            for (var i = 0; i < cache.abc.length; i++) {
                cache.cba[cache.abc[i]] = i;
            }
        }
        this._abc = this._abcCache[abc].abc;
        this._cba = this._abcCache[abc].cba;
        this._value = value;
        this._index = 0;
    },

    read: function() {
        return this._cba[this.readChars(1)];
    },

    readChars: function(count) {
        if (this._index + count <= this._value.length) {
            if (count === 1) {
                return this._value[this._index++];
            } else {
                this._index += count;
                return this._value.substring(this._index - count, this._index);
            }
        } else {
            throw new RangeError('Unexpected end of buffer.');
        }
    },

    write: function(byte) {
        if (typeof byte !== 'number' || byte < 0 || byte > 63) {
            throw new RangeError('byte must be a number between 0 and 63.');
        }
        this.writeChars(this._abc[byte]);
    },

    writeChars: function(chars) {
        this._value += chars;
    },

    getValue: function() {
        return this._value;
    }
});
