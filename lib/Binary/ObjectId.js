Binary.ObjectId = Bricks.inherit(Binary.Type, {
    constructor: function() {
        Binary.ObjectId.superclass.constructor.apply(this, arguments);
        this._fixedInt = new Binary.FixedInt(2);
    },

    encodeBuffer: function(hex, buffer) {
        hex = String(hex);
        if (!/^[0-9a-f]{24}$/.test(hex)) {
            throw new TypeError('MongoDB Object id must be 24 hex symbols, but received ' + hex);
        }
        var fixedInt = this._fixedInt;
        hex.replace(/.../g, function(part) {
            fixedInt.encodeBuffer(parseInt(part, 16), buffer);
        });
    },

    decodeBuffer: function(buffer) {
        var hexParts = [];
        for (var i = 0; i < 8; i++) {
            var part = this._fixedInt.decodeBuffer(buffer).toString(16);
            while (part.length < 3) {
                part = '0' + part;
            }
            hexParts.push(part);
        }
        return hexParts.join('');
    }
});
