Binary.HexColor = Bricks.inherit(Binary.Type, {
    constructor: function() {
        Binary.HexColor.superclass.constructor.apply(this, arguments);
        this._fixedInt = new Binary.FixedInt(2);
    },

    encodeBuffer: function(hex, buffer) {
        if (hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/)) {
            hex = '#' + RegExp.$1 + RegExp.$1 + RegExp.$2 + RegExp.$2 + RegExp.$3 + RegExp.$3;
        }
        if (!/^#[0-9a-f]{6}$/.test(hex)) {
            throw new TypeError('Hex color must be # and 3 or 6 hex symbols, but received ' + hex);
        }
        var fixedInt = this._fixedInt;
        hex.substr(1).replace(/.../g, function(part) {
            fixedInt.encodeBuffer(parseInt(part, 16), buffer);
        });
    },

    decodeBuffer: function(buffer) {
        var hexParts = [];
        for (var i = 0; i < 2; i++) {
            var part = this._fixedInt.decodeBuffer(buffer).toString(16);
            while (part.length < 3) {
                part = '0' + part;
            }
            hexParts.push(part);
        }
        return '#' + hexParts.join('');
    }
});
