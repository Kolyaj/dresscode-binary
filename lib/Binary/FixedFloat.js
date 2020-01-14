Binary.FixedFloat = Bricks.inherit(Binary.Type, {
    constructor: function(fractionDigits, minValue) {
        Binary.FixedFloat.superclass.constructor.apply(this, arguments);
        fractionDigits = fractionDigits || 0;
        this._mult = Math.pow(10, fractionDigits);
        this._int = new Binary.Int(typeof minValue === 'number' ? minValue * this._mult : undefined);
    },

    encodeBuffer: function(value, buffer) {
        this._int.encodeBuffer(Math.round(value * this._mult), buffer);
    },

    decodeBuffer: function(buffer) {
        return this._int.decodeBuffer(buffer) / this._mult;
    }
});
