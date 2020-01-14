Binary.UnsafeString = Bricks.inherit(Binary.Type, {
    constructor: function(length) {
        Binary.UnsafeString.superclass.constructor.apply(this, arguments);
        this._length = length;
        this._int = new Binary.Int();
    },

    encodeBuffer: function(value, buffer) {
        value = String(value);
        if (!this._length) {
            this._int.encodeBuffer(value.length, buffer);
        }
        buffer.writeChars(value);
    },

    decodeBuffer: function(buffer) {
        return buffer.readChars(this._length || this._int.decodeBuffer(buffer));
    }
});
