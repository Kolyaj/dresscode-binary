Binary.BigBitmap = Bricks.inherit(Binary.Type, {
    constructor: function() {
        Binary.BigBitmap.superclass.constructor.apply(this, arguments);
        this._arrayOfBitmap = new Binary.ArrayOf(new Binary.Bitmap());
    },

    encodeBuffer: function(value, buffer) {
        var arr = [];
        for (var i = 0; i < value.length; i += 52) {
            arr.push(value.slice(i, i + 52));
        }
        this._arrayOfBitmap.encodeBuffer(arr, buffer);
    },

    decodeBuffer: function(buffer) {
        var arr = this._arrayOfBitmap.decodeBuffer(buffer);
        var value = [];
        for (var i = 0; i < arr.length; i++) {
            [].push.apply(value, arr[i]);
        }
        return value;
    }
});
