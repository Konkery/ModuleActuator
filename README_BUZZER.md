<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleServo

<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

## Лицензия

<div style = "color: #555">

В разработке
</div>

## Описание
<div style = "color: #555">

Модуль предназначен для прикладной работы пьезозуммерами в рамках фреймворка EcoLight и обеспечивает следующий функционал:
- Инициализацию и идентификацию различных моделей пьезозуммеров в соответствии с их характеристиками;
- Включение пьезозуммера с заданной частотой;
- Генерация различных звуковых паттернов и их проигрыш посредством выполнения тасков.

Модуль разработан в соответствии с [архитектурой актуаторов](https://github.com/Konkery/ModuleActuator/blob/main/README.md), соответственно, *ClassServo* наследует и реализует является функционал *ClassMiddleActuator*, а прикладная работа с данным модулем выполняется через *ClassChannelActuator*, который обеспечивает унифицированный интерфейс.

</div>

## Конструктор
<div style = "color: #555">

В соответствии с подходом, заложенным ModuleActuator, конструктор принимает 1 объект типа **ActuatorOptsType** и 1 объект типа **ActuatorPropsType** (подробнее по [ссылке](https://github.com/Konkery/ModuleActuator/blob/fork-nikita/README_ANCESTOR.md#%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80)).
Пример *_actuatorProps* типа [**ActuatorOptsType**](https://github.com/Konkery/ModuleActuator/blob/main/README.md):
```js
const actuator_props = ({
    name: "Buzzer",
    type: "actuator",
    channelNames: ['freq'],
    typeInSignals: ["analog"],
    quantityChannel: 1,
    busTypes: [],
    manufacturingData: {
        IDManufacturing: [
            { "Adafruit": "PS1240" }  
        ],
        IDsupplier: [
            { "Adafruit": "PS1240" }  
        ],
        HelpSens: "Piezo buzzer"
    }
});
```
Пример *_opts* типа [**ActuatorOptsType**](https://github.com/Konkery/ModuleActuator/blob/main/README.md):
```js
const _opts = {
    pins: [A0],     //массив пинов
}

```

</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Range</mark> - диапазон работы сервопривода. Также соответсвует максимальному углу, который который может занять актуатор;
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">On(_chNum, _pos)</mark> - выполняет поворот вала сервопривода в указанное положение. При работе через канал, аргумент *_chNum* пропускается;
- <mark style="background-color: lightblue">Off()</mark> - прекращает удержание угла сервоприводом;
- <mark style="background-color: lightblue">Reset()</mark> - устанавливает вал сервоприпода его в начальное положение, заданное через конструктор либо равное мин.возможному.
</div>

### Примеры
#### Инициализация и запуск пьезо-зуммера
<div style = "color: #555">

```js
//Импорт зависимостей
const ClassAppError     = require('ModuleAppError.min');
    require('ModuleAppMath.min').is();
const ClassMiddleActuator = require('ModuleActuator.min');
const ClassBuzzer         = require('ModuleBuzzer.min');

//Аргументы для инициализации объекта актуатора
const actuator_props = ({
    name: "Buzzer",
    type: "actuator",
    channelNames: ['freq'],
    typeInSignals: ["analog"],
    quantityChannel: 1,
    busTypes: [],
    manufacturingData: {
        IDManufacturing: [
            { "Adafruit": "PS1240" }  
        ],
        IDsupplier: [
            { "Adafruit": "PS1240" }  
        ],
        HelpSens: "Piezo buzzer"
    }
});
//Инициализация 
const bz = new ClassBuzzer(actuator_props, { pins: [P2] });
const ch = bz.GetChannel(0);
//Запуск работы зуммера с частотой 600 Гц
ch.On(600);
//Запуск с другой частотой через 1 сек
setTimeout(() => { 
    ch.On(1000);    
}, 1500);
//Прекращение работы
setTimeout(() => { 
    ch.Off(); 
}, 3000);
```

</div>

#### Запуск цепочки тасков
<div style = "color: #555">

```js
//Вызов одного пика через основной, универсальный таск 
ch.RunTask('PlaySound', { freq: 300, numRep: 1, prop: 0.5, pulseDur: 800 });  
.then(
    // Вызов пика через таск, принимающий частоту и длину импульса 
    () => ch.RunTask('BeepOnce', 500, 800);
).then(
    // вызов двойного звукового сигнала
    () => ch.RunTask('BeepTwice', 800, 500);                   
).then(
    () => { console.log('Done!'); }
);
```

</div>

#### Добавление нового таска
<div style = "color: #555">

```js
//Объявление элементарного таска, запускающего зуммер на 3 сек
ch.AddTask('Beep3sec', (freq) => {
    this.On(freq);
    setTimeout(() => {
        this.Off();
        //Завершение выполнения таска
        this.ResolveTask(0);
    }, 3000);
});

ch.RunTask('Beep3sec', 500);
    .then(() => print(`Done after 3 sec!`));
```

</div>

#### Отмена выполнения таска после его вызова 
<div style = "color: #555">

```js
ch.RunTask('BeepTwice', 500, 1200);

setTimeout(() => {
    ch.CancelTask();
}, 1000);
```

</div>

#### Результат выполнения:

<div align='left'>
    <img src="" alt="Image not found">
</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ModuleActuator](https://github.com/Konkery/ModuleActuator/blob/main/README.md)</mark>
- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>
