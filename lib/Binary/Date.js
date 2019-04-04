Binary.Date = Bricks.inherit(Binary.Type, {
    constructor: function() {
        Binary.Date.superclass.constructor.apply(this, arguments);
        this._fixedInt = new Binary.FixedInt(8);
    },

    encodeBuffer: function(value, buffer) {
        this._fixedInt.encodeBuffer(value.getTime(), buffer);
    },

    decodeBuffer: function(buffer) {
        return new Date(this._fixedInt.decodeBuffer(buffer));
    }
});
