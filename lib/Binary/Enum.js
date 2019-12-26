Binary.Enum = Bricks.inherit(Binary.Type, {
    constructor: function(values) {
        Binary.Enum.superclass.constructor.apply(this, arguments);
        this._values = values;
        this._int = new Binary.Int(0);
    },

    encodeBuffer: function(value, buffer) {
        var index = this._values.indexOf(value);
        if (index === -1) {
            throw new TypeError('Unexpected value of enum');
        }
        this._int.encodeBuffer(index, buffer);
    },

    decodeBuffer: function(buffer) {
        return this._values[this._int.decodeBuffer(buffer)];
    }
});
