Binary.Int = Bricks.inherit(Binary.Type, {
    constructor: function(minValue) {
        Binary.Int.superclass.constructor.apply(this, arguments);
        this._minValue = minValue;
    },

    encodeBuffer: function(value, buffer) {
        if (typeof value !== 'number') {
            throw new TypeError('value must be a number');
        }
        if (typeof this._minValue === 'number') {
            value -= this._minValue;
            if (value < 0) {
                throw new RangeError('value must be >= minValue');
            }
        } else {
            if (value < 0) {
                value = -value * 2 + 1;
            } else {
                value *= 2;
            }
        }
        while (value > 31) {
            buffer.write(32 + (value % 32));
            value = Math.floor(value / 32);
        }
        buffer.write(value);
    },

    decodeBuffer: function(buffer) {
        var byte;
        var value = 0;
        var mult = 1;
        do {
            byte = buffer.read();
            value += (byte % 32) * mult;
            mult *= 32;
        } while (byte > 31);
        if (typeof this._minValue === 'number') {
            value += this._minValue;
        } else {
            if (value % 2) {
                value = (1 - value) / 2;
            } else {
                value /= 2;
            }
        }
        return value;
    }
});
