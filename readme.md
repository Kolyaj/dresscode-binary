# dresscode-binary

Библиотека кодирования данных в бинарный 6-битный формат (символы из алфавита base64, адаптированного для использования в URL). Код оформлен в методологии [DressCode](https://github.com/Kolyaj/DressCodeJS).

Основная цель создания библиотеки – сохранение данных в localStorage, когда это основное хранилище данных. Binary кодирует данные более компактно и обфусцированно, чем JSON. Можно использовать Binary и для передачи данных с сервера, что уменьшит трафик, но добавит необходимость описания схемы данных.

Для подключения выполните `npm i dresscode-binary` и добавьте в файл .dresscode строку `path-to-node_modules/dresscode-binary/lib`.

## Философия

В прикладном коде создаются кодировщики с какими-то параметрами. Такой кодировщик может закодировать заданный тип значений, а другой кодировщик с такими же параметрами сможет закодированную строку декодировать в то же самое значение.

Например, кодировщик `Binary.Int` кодирует целые числа.

    var int1 = new Binary.Int();
    var data = int1.encode(100); // oG
    var int2 = new Binary.Int();
    console.log(int2.decode(data)); // 100
    
При этом конструктор `Binary.Int` может принимать параметром минимальное значение, меньше которого числа точно не будут. Строки, закодированные таким кодировщиком, нужно декодировать кодировщиком с таким же минимальным значением.

    var int1 = new Binary.Int(100);
    var data = int1.encode(200);  // kD
    var int2 = new Binary.Int();  // не подходящий для декодирования кодировщик
    console.log(int2.decode(data)); // 50
    var int3 = new Binary.Int(100); // подходящий для декодирования кодировщик
    console.log(int3.decode(data)); // 200 

## Встроенные кодировщики

### `Binary.Packet`

Основной кодировщик в библиотеке. Принимает схему данных и кодирует объекты именно с теми свойствами и типами значений, которые указаны в схеме. Схема это объект, свойствами которого являются экземпляры кодировщиков, которые будут кодировать свойства с тем же именем.

    var packet = new Binary.Packet({
        version: new Binary.Int(0),
        size: new Binary.ArrayOf(new Binary.Int(0))
    });
    var data = packet.encode({version: 5, size: [10, 20]}); // HFCKU
    console.log(packet.decode(data));  // {version: 5, size: [10, 20]}
    
Пакеты могут быть вложенными.

    var packet = new Binary.Packet({
        version: new Binary.Int(0),
        size: new Binary.Packet({
            width: new Binary.Int(0),
            height: new Binary.Int(0)
        })
    });

Все свойства в схеме данных являются необязательными.
    
    var data1 = packet.encode({version: 5}); // GF
    console.log(packet.decode(data1)); // {version: 5}
    
Т.к. все свойства необязательные, можно обновлять схему данных добавлением новых свойств в конец списка. Тогда новый пакет сможет декодировать данные, закодированные старым пакетом, что обеспечивает изменение схемы с сохранением обратной совместимости.

    var packet1 = new Binary.Packet({
        foo: new Binary.Int()
    }); 
    var data = packet1.encode({foo: 5}); // DK
    var packet2 = new Binary.Packet({
        foo: new Binary.Int(),
        bar: new Binary.String()
    });
    console.log(packet2.decode(data)); // {foo: 5}
    
Таким образом для сохранения обратной совместимости с уже закодированными данными при обновлении схемы важно придерживаться двух правил: 

    1. Никогда не удалять свойства из схемы. Просто кодировать данные без этих свойств и ожидать при декодировании эти свойства могут появиться, если, например, у пользователя в localStorage лежат данные годовой давности.
    2. Новые свойства добавлять только в конец списка. 

### `Binary.Int`

Кодирует целое число. Если про кодируемые значения доподлинно известно, что они не меньше какого-то числа, то можно задать это число в качестве минимального значения: `new Binary.Int(100)`, это позволит уменьшить объём закодированных данных. Таким образом беззнаковое целое, т.е. положительные числа, кодируется кодировщиком `new Binary.Int(0)`.

### `Binary.FixedInt`

Кодирует целое число в заранее заданное число символов. Т.к. в один символ умещается 6 бит, то максимальное значение, которое можно закодировать с параметром size: 2 ^ (size * 6) - 1. Например, кодировщик `new Binary.FixedInt(3)` может кодировать числа от 0 до 262143. Полезно для чисел, про которые известно, что они редко близки к нулю, но точно не превышают определённого значения. Если такие числа кодировать с помощью `Binary.Int`, то результат будет объёмней из-за использования служебных битов.

### `Binary.String`

Кодирует произвольную строку. Параметром можно задать длину кодируемых строк, если она фиксированна: `new Binary.String(255)`.

### `Binary.Date`

Кодирует объект `Date`.

### `Binary.Enum`

Кодирует одно из предзаданных значений. Сохраняет не само значение, а его индекс в предзаданном массиве.

    var encoder = new Binary.Enum(['success', 'error']);
    encoder.encode('success');  // A
    encoder.encode('error');  // B
    encoder.encode('somevalue');  // TypeError: Unexpected value of enum
    
### `Binary.ObjectId`

Кодирует MongoDB ObjectId в 64-ричный код. На треть сжимает объём текстового представления ObjectId.

### `Binary.HexColor`

Кодирует цвет заданный в формате CSS. Может принимать как трёх-значные цвета (#ccc), так и полные шестизначные (#abcdef). На выходе всегда шестизначный цвет.

### `Binary.ArrayOf`

Массив данных, которые кодируются кодировщиком из первого аргумента. Вторым аргументом можно зафиксировать длину массива.

    new Binary.ArrayOf(new Binary.Int(0)); // кодирует массив положительных чисел

### `Binary.Bitmap`

Кодирует массив булевых значений в битовую маску.

    new Binary.Bitmap().encode([true, false, true, false]); // a


## Создание собственных кодировщиков

Скорее всего в вашем приложении будут специфические данные, которые выгоднее не сводить к числам и строкам, а сделать для них свои кодировщики. Например, надо кодировать числа от 0 до 63. В силу своей универсальности у `new Binary.Int(0)` длина кода будет в среднем 1.5 символа на число. Но зная, что числа находятся в диапазоне от 0 до 63, можно уместить их в 1 символ.

Кодировщик должен наследовать `Binary.Type` и предоставлять два метода: `encodeBuffer` и `decodeBuffer`. `encodeBuffer` принимает кодируемое значение и экземпляр класса `Binary.Buffer`, куда требуется записать данные. `decodeBuffer` принимает экземпляр класса `Binary.Buffer`, из которого требуется прочитать данные, и возвращает раскодированное значение.

`Binary.Buffer` имеет два метода, необходимых для работы кодировщика. Метод `write` принимает число от 0 до 63 и записывает его в закодированную строку в виде символа из алфавита. Метод `read` читает очередной символ из закодированной строки и возвращает соответствующее число от 0 до 63. Если метод `read` был вызван, когда данные в буфере уже закончились, бросается исключение `RangeError`.

    var Int0to63 = Bricks.inherit(Binary.Type, {
        encodeBuffer: function(value, buffer) {
            buffer.write(value);
        },
        
        decodeBuffer: function(buffer) {
            return buffer.read();
        }
    }); 

Скорее всего у вас не будет необходимости вызывать методы `Binary.Buffer` напрямую, а достаточно будет использовать уже существующие кодировщики. Совсем искусственный пример: нужно сохранять числа, которые всегда кратны 1000, а значит нет необходимости записывать последние три нуля.

    var Thousands = Bricks.inherit(Binary.Type, {
        constructor: function() {
            Thousands.superclass.constructor.apply(this, arguments);
            this._int = new Binary.Int(0);            
        },
        
        encodeBuffer: function(value, buffer) {
            this._int.encodeBuffer(value / 1000, buffer);
        },
        
        decodeBuffer: function(buffer) {
            return this._int.decodeBuffer(buffer) * 1000;
        }
    });
