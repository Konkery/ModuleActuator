<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ClassMiddleActuator
<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

## Описание
<div style = "color: #555">

Является ключевой составляющей модуля [Actuator](./README.md). Смысл данного класса заключается в унификации работы с актуаторами и их каналами, что упрощает работу прикладным разработчикам в рамках фрейморка EcoLight. Наследуется от [ClassAncestorActuator](./README_ANCESTOR.md).
Реализует важнейшие принципы **ModuleActuator**:
- Обработка вх. сигнала: в точке запуска базового метода работы актуатора есть прослойка, через которую проходит ключевой аргумент (частота), позволяя применять ограничительные функции, трансформирующую линейную функцию и проверку значения на нахождение в заданных зонах. Это позволяет предотвращать ошибки, связанные с передаачей некорректных аргументов (см. подробнее в [ClassDataRefine](./README_DATA_REFINE.md#обработка-значений-с-датчика));
- Автоматическое создание каналов: при инициализации "реального" актутора рассматриваемый класс автоматически создает [объекты-каналы](./README_CHANNEL.md), которые композируются в поле этого класса. Это упрощает создание и управление каналами актуатора;
- Определение сигнатур методов: класс определяет сигнатуры основных методов, которые после переопределения будут доступны для работы с "реальными" актуаторами и их каналами. Это обеспечивает единый интерфейс для инициализации, запуска, настройки и управления актуаторами.
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Channels</mark> - массив с автоматически инстанцирующимися объектами ClassChannelActuator;
- <mark style="background-color: lightblue">_IsChOn</mark> - массив булевых значений, в котором i-й элемент указывает, подается ли сигнал на i-й канал в данный момент.
</div>

### Аксессоры
<div style = "color: #555">

- <mark style="background-color: lightblue">CountChannels</mark> - геттер, возвращающий количество корректно инициализированных каналов типа **ClassChannelActuator**.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">InitСhannels()</mark> - инициализирует объекты каналов, запускает обработку аргументов, поступающих на метод On();
- <mark style="background-color: lightblue">GetInfo()</mark> - обязывает вернуть объект, хранящий информацию об актуаторе;
- <mark style="background-color: lightblue">Init(_opts)</mark> - обязывает выполнить инициализацию актуатора, применив необходимые для его работы настройки;
- <mark style="background-color: lightblue">ConfigureRegs(_opts)</mark> - обязывает выполнить дополнительную конфигурацию актуатора. Это настройки, которые необходимы для ряда задач, но могут переопределяться в процессе работы, и потому вынесены из метода Init();
- <mark style="background-color: lightblue">GetChannel(_chNum)</mark> - возвращает объект i-го канала;
- <mark style="background-color: lightblue">On(_chNum, _val)</mark> - обязывает начать работу определенного канала актуатора;
- <mark style="background-color: lightblue">Off(_chNum)</mark> - обязывает прекратить подачу сигнала на актуатор;
- <mark style="background-color: lightblue">Reset()</mark> - обязывает выполнить перезагрузку актуатора;
- <mark style="background-color: lightblue">Read(_reg)</mark> - обязывает выполнить чтение с регистра;
- <mark style="background-color: lightblue">Write(_reg, _val)</mark> - обязывает выполнить запись в регистр.
</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>