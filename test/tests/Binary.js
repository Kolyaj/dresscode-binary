function check(message, type, value, err) {
    it(message, function() {
        if (err) {
            chai.assert.throws(function() {
                type.encode(value);
            }, err);
        } else {
            var data = type.encode(value);
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

describe('Binary.Enum', function() {
    check('Existing value', new Binary.Enum(['value1', 'value2']), 'value2');
    check('Not existing value', new Binary.Enum(['value1', 'value2']), 'value3', TypeError);
    check('Numeric values', new Binary.Enum([1, 2, 3]), 3);
    check('Numeric enum encodes string value', new Binary.Enum([1, 2, 3]), '2', TypeError);
});

describe('Binary.ObjectId', function() {
    check('Valid MongoDB ObjectId', new Binary.ObjectId(), '5bdad1bb9451b44a137f2f53');
    check('ObjectId with many zeros', new Binary.ObjectId(), '000000000000000000000000');
    check('Invalid length of ObjectId', new Binary.ObjectId(), 'fff', TypeError);
    check('Invalid symbols in ObjectId', new Binary.ObjectId(), '5bdad1bb9451b44a137f2f5g', TypeError);
    it('Length of code', function() {
        chai.assert.equal(new Binary.ObjectId().encode('5bdad1bb9451b44a137f2f53').length, 16);
    });
});

describe('Binary.HexColor', function() {
    check('#cdef34', new Binary.HexColor(), '#cdef34');
    check('#cdef345', new Binary.HexColor(), '#cdef345', TypeError);
    check('#cdef', new Binary.HexColor(), '#cdef', TypeError);
    it('#abc', function() {
        var encoder = new Binary.HexColor();
        chai.assert.equal(encoder.decode(encoder.encode('#abc')), '#aabbcc');
    });
});

describe('Binary.FixedFloat', function() {
    check('5', new Binary.FixedFloat(2, 0), 5);
    check('1.23', new Binary.FixedFloat(3, 0), 1.23);
    it('1.234 and 2 fraction digits', function() {
        var encoder = new Binary.FixedFloat(2);
        chai.assert.equal(encoder.decode(encoder.encode(1.234)), 1.23);
    })
});

describe('Binary.UnsafeString', function() {
    check('Какая-то строка русскими буквами', new Binary.UnsafeString(), 'Какая-то строка русскими буквами');
});
