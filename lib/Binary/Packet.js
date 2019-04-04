Binary.Packet = Bricks.inherit(Binary.Type, {
    constructor: function(schema) {
        Binary.Packet.superclass.constructor.apply(this, arguments);
        this._schema = schema;
        this._bitmap = new Binary.Bitmap();
    },

    encodeBuffer: function(value, buffer) {
        var propsBitmap = [];
        var values = [];
        Pony.Object.keys(this._schema).forEach(function(prop) {
            if (value[prop] === null || value[prop] === undefined) {
                propsBitmap.push(false);
            } else {
                propsBitmap.push(true);
                values.push({
                    type: this._schema[prop],
                    value: value[prop]
                });
            }
        }, this);
        this._bitmap.encodeBuffer(propsBitmap, buffer);
        for (var i = 0; i < values.length; i++) {
            values[i].type.encodeBuffer(values[i].value, buffer);
        }
    },

    decodeBuffer: function(buffer) {
        var propsBitmap = this._bitmap.decodeBuffer(buffer);
        var value = {};
        Pony.Object.keys(this._schema).forEach(function(prop, index) {
            if (propsBitmap[index]) {
                value[prop] = this._schema[prop].decodeBuffer(buffer);
            }
        }, this);
        return value;
    }
});
