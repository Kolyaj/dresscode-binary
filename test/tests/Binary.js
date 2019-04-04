function check(message, type, value, err) {
    it(message, function() {
        if (err) {
            chai.assert.throws(function() {
                type.encode(value);
            }, err);
        } else {
            var data = type.encode(value);
            chai.assert.isOk(/^[a-zA-Z0-9*-]+$/.test(data));
            chai.assert.deepEqual(type.decode(data), value);
        }
    });
}

describe('Binary.FixedInt', function() {
    check('new Binary.FixedInt(3), 100000', new Binary.FixedInt(3), 100000);
    check('new Binary.FixedInt(2), 4100', new Binary.FixedInt(2), 4100, RangeError);
    it('size of code from Binary.FixedInt(4) must be equal to 4', function() {
        chai.assert.equal(new Binary.FixedInt(1).encode(50).length, 1);
        chai.assert.equal(new Binary.FixedInt(2).encode(50).length, 2);
        chai.assert.equal(new Binary.FixedInt(3).encode(50).length, 3);
        chai.assert.equal(new Binary.FixedInt(4).encode(50).length, 4);
        chai.assert.equal(new Binary.FixedInt(4).encode(500).length, 4);
        chai.assert.equal(new Binary.FixedInt(4).encode(5000).length, 4);
        chai.assert.equal(new Binary.FixedInt(4).encode(50000).length, 4);
    });
});

describe('Binary.Date', function() {
    check('new Binary.Date(), now', new Binary.Date(), new Date());
});

describe('Binary.Int', function() {
    check('new Binary.Int(0), 5', new Binary.Int(0), 5);
    check('new Binary.Int(0), 50', new Binary.Int(0), 50);
    check('new Binary.Int(0), 500', new Binary.Int(0), 500);
    check('new Binary.Int(0), 5000', new Binary.Int(0), 5000);
    check('new Binary.Int(), -5', new Binary.Int(), -5);
    check('new Binary.Int(), -50', new Binary.Int(), -50);
    check('new Binary.Int(), -500', new Binary.Int(), -500);
    check('new Binary.Int(), -5000', new Binary.Int(), -5000);
    check('new Binary.Int(0), -5000', new Binary.Int(0), -5000, RangeError);
    check('new Binary.Int(10), 5', new Binary.Int(10), 5, RangeError);
    check('new Binary.Int(10), 50', new Binary.Int(10), 50);
    check('new Binary.Int(-10000), -500', new Binary.Int(-10000), -500);
    check('new Binary.Int(-10000), -5000', new Binary.Int(-10000), -5000);
    check('big number', new Binary.Int(0), new Date().getTime());
});

describe('Binary.String', function() {
    check('new Binary.String(), abc', new Binary.String(), 'abc');
    check('new Binary.String(), абв', new Binary.String(), 'абв');
    check('new Binary.String(), empty', new Binary.String(), '');
    check('new Binary.String(5), abcde', new Binary.String(5), 'abcde');
});

describe('Binary.Bitmap', function() {
    check('new Binary.Bitmap(), [true, false, true]', new Binary.Bitmap(), [true, false, true]);
    check('new Binary.Bitmap(), [false, true, false]', new Binary.Bitmap(), [false, true, false]);
});

describe('Binary.ArrayOf', function() {
    check('array of numbers', new Binary.ArrayOf(new Binary.Int(0)), [0, 5, 50, 500]);
    check('array of 5 numbers', new Binary.ArrayOf(new Binary.Int(0), 5), [0, 5, 50, 500, 5000]);
});

describe('Binary.Packet', function() {
    check('{foo: number, bar: string}', new Binary.Packet({foo: new Binary.Int(), bar: new Binary.String()}), {foo: 5, bar: 'bar'});
    check('{foo: number, bar: string} without foo', new Binary.Packet({foo: new Binary.Int(), bar: new Binary.String()}), {bar: 'bar'});
    check('{foo: number, bar: string} without bar', new Binary.Packet({foo: new Binary.Int(), bar: new Binary.String()}), {foo: 10});
    check('{foo: {foo: number}}', new Binary.Packet({foo: new Binary.Packet({foo: new Binary.Int()})}), {foo: {foo: 500}});
    it('Encoded by {foo: number}, decoded by {foo: number, bar: number}', function() {
        var packet1 = new Binary.Packet({
            foo: new Binary.Int()
        });
        var packet2 = new Binary.Packet({
            foo: new Binary.Int(),
            bar: new Binary.Int()
        });
        chai.assert.deepEqual(packet2.decode(packet1.encode({foo: 1})), {foo: 1});
    });
});
