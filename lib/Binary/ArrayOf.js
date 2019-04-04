Binary.ArrayOf = Bricks.inherit(Binary.Type, {
    constructor: function(type, length) {
        Binary.ArrayOf.superclass.constructor.apply(this, arguments);
        this._type = type;
        this._length = length;
        this._int = new Binary.Int(0);
    },

    encodeBuffer: function(value, buffer) {
        if (!this._length) {
            this._int.encodeBuffer(value.length, buffer);
        }
        for (var i = 0; i < value.length; i++) {
            this._type.encodeBuffer(value[i], buffer);
        }
    },

    decodeBuffer: function(buffer) {
        var length = this._length || this._int.decodeBuffer(buffer);
        var value = [];
        for (var i = 0; i < length; i++) {
            value.push(this._type.decodeBuffer(buffer));
        }
        return value;
    }
});
