Binary.Type = Bricks.inherit({
    encode: function(value) {
        var buffer = new Binary.Buffer();
        this.encodeBuffer(value, buffer);
        return buffer.getValue();
    },

    decode: function(data) {
        return this.decodeBuffer(new Binary.Buffer(data));
    }
});
