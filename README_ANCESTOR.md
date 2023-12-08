<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ClassAncestorActuator 
<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

## Описание
<div style = "color: #555">

Базовый класс в стеке [ModuleActuator](./README.md). Является отправной точкой для создания объектов конкретных актуаторов и обеспечивает сбор и хранение информации о них. Его поля предоставляют основные характеристики, необходимых для идентификации и настройки актуатора в рамках фреймоворка EcoLight. В первую очередь собирает в себе самые базовые сведения об актуаторе: переданные в его конструктор параметры и описательную характеристику. Перечень полей см. ниже.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает два параметра: объект типа **ActuatorPropsType** и объект типа **ActuatorOptsType**.

Образец параметра *_actuatorProps* типа **ActuatorPropsType**: 
```js
const act_props = ({
    name: "Buzzer",
    type: "actuator",
    channelNames: ["freq"],
    typeInSignals: ["analog"],
    quantityChannel: 1,
    busTypes: [],
    manufacturingData: {
        IDManufacturing: [
            { "Adafruit": "4328435534" }  
        ],
        IDsupplier: [
            { "Adafruit": "4328435534" }  
        ],
        HelpSens: "buzzer"
    }
});
```
Образец параметра *_opts* типа **ActuatorOptsType**:
```js
const _opts = {
    bus: bus,           //объект шины
    pins: [B14, B15],   //массив используемых пинов 
    address: 0x29       //адрес на шине
}
```

</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Bus</mark> - используемая шина;
- <mark style="background-color: lightblue">_Pins</mark> - массив используемых актуатором пинов;
- <mark style="background-color: lightblue">_Address</mark> - адрес актуатора на шине;
- <mark style="background-color: lightblue">_Bus</mark> - используемая шина;
- <mark style="background-color: lightblue">_Name</mark> - имя актуатора;
- <mark style="background-color: lightblue">_Type</mark> - тип устройства (для всех актуаторов имеет значение "actuator");
- <mark style="background-color: lightblue">_ChannelNames</mark> - массив с названиями каналов;
- <mark style="background-color: lightblue">_TypeInSignals</mark> - типы входых сигналов;
- <mark style="background-color: lightblue">_QuantityChannel</mark> - число физических каналов актуатора;
- <mark style="background-color: lightblue">_BusTypes</mark> - массив со строковыми представлениями типов шин, на которых может работать актуатор;
- <mark style="background-color: lightblue">_ManufacturingData</mark> - объект со сведениями о производителе и поставщике актуатора, а так же его односложное описание;
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">InitProps(_actuatorProps)</mark> - инициализирует поля, хранящие описательные характеристики актуатора.
</div>

### Примеры
<div style = "color: #555">

Данный класс применяется исключительно как звено наследования и не используется независимо. Потому наследники обязаны иметь такие же параметры конструктора, который ввиду особенностей среды выполнения Espruino вызывается таким образом:
```js
ClassAncestorActuator.apply(this, [_actuatorProps, _opts]);
/// либо
ClassAncestorActuator.call(this, _actuatorProps, _opts);
```
</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>