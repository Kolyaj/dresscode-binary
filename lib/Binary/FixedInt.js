Binary.FixedInt = Bricks.inherit(Binary.Type, {
    constructor: function(size) {
        Binary.FixedInt.superclass.constructor.apply(this, arguments);
        this._size = size;
        this._maxValue = Math.pow(64, this._size) - 1;
    },

    encodeBuffer: function(value, buffer) {
        if (value < 0 || value > this._maxValue) {
            throw new RangeError('value must be between 0 and ' + this._maxValue);
        }
        for (var mult = Math.pow(64, this._size - 1); mult >= 1; mult /= 64) {
            buffer.write(Math.floor(value / mult) % 64);
        }
    },

    decodeBuffer: function(buffer) {
        var value = 0;
        for (var mult = Math.pow(64, this._size - 1); mult >= 1; mult /= 64) {
            value += buffer.read() * mult;
        }
        return value;
    }
});
