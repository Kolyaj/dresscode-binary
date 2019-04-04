Binary.Bitmap = Bricks.inherit(Binary.Type, {
    constructor: function() {
        Binary.Bitmap.superclass.constructor.apply(this, arguments);
        this._int = new Binary.Int(0);
    },

    encodeBuffer: function(value, buffer) {
        var number = 1;
        for (var i = 0; i < value.length; i++) {
            number = (number << 1) + (value[i] ? 1 : 0);
        }
        this._int.encodeBuffer(number, buffer);
    },

    decodeBuffer: function(buffer) {
        var number = this._int.decodeBuffer(buffer);
        var value = [];
        while (number > 1) {
            value.unshift(Boolean(number % 2));
            number >>= 1;
        }
        return value;
    }
});
