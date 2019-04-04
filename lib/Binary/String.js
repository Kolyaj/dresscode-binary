Binary.String = Bricks.inherit(Binary.Type, {
    constructor: function(length) {
        Binary.String.superclass.constructor.apply(this, arguments);
        this._length = length;
        this._int = new Binary.Int(0);
    },

    encodeBuffer: function(value, buffer) {
        value = String(value);
        if (!this._length) {
            this._int.encodeBuffer(value.length, buffer);
        }
        for (var i = 0; i < value.length; i++) {
            this._int.encodeBuffer(value.charCodeAt(i), buffer);
        }
    },

    decodeBuffer: function(buffer) {
        var length = this._length || this._int.decodeBuffer(buffer);
        var codes = [];
        for (var i = 0; i < length; i++) {
            codes.push(this._int.decodeBuffer(buffer));
        }
        return String.fromCharCode.apply(String, codes);
    }
});
