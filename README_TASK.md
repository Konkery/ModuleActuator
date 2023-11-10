<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ClassTask
<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

### Описание
<div style = "color: #555">

Класс, являющийся частью архитектуры [ModuleActuator](./README.md). Реализует собой сущность таска (задания).
В рамках прикладного кода таск - это набор инструкций, асинхронно исполняющихся актуатором.

А технически - объект класса, хранящий прикладную функцию, обернутую в Promise, а так же набор свойств и методов, необходимых для контроля над статусом выполнения функции таска.   

</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_IsActive</mark> - булевое значение указывает, исполняется ли в данный момент таск;
- <mark style="background-color: lightblue">_Func</mark> - функция, реализующая выполнение таска актуатором;
- <mark style="background-color: lightblue">_Channel</mark> - ссылка на канал, к которому относится данный таск.
</div>

### Методы
<div style = "color: #555">
- <mark style="background-color: lightblue">Invoke(...args)</mark> - запускает выполнение таска;
- <mark style="background-color: lightblue">Resolve(_code)</mark> - деактивирует таск как успешно завершенный;
- <mark style="background-color: lightblue">Reject(_code_)</mark> - деактивирует таск как завершенный с ошибкой; 
- <mark style="background-color: lightblue">Cancel()</mark> - завершает данный таск в процессе исполнения.
</div>

### Примеры
<div style = "color: #555">

##### Замечание 

Инициализация нового таска имеет некоторые нюансы и правила:
1. Контекст передаваемой функции автоматически привязывается к объекту канала. Это необходимо учитывать при её определении
2. В точке выхода из функции, уже после завершения работы актутаора, обязан вызываться `this.${TaskName}.Resolve()`. Это необходимо чтобы уведомить систему о завершении выполнения таска;
3. В коде функции не может быть вызовов иных тасков. Исключенем является сценарий, когда вся функция сводится к вызову другого таска и этим завершается. В таком случае при вызове необходимо последним аргументом передавать идентификатор объявляемого таска.

#### Добавление нового таска
<div style = "color: #555">

```js
//Объявление элементарного таска, запускающего зуммер на 3 сек
ch.AddTask('Beep3sec', (freq) => {
    this.On(freq);
    setTimeout(() => {
        this.Off();
        //Завершение выполнения таска
        this.Beep3sec.Resolve(0);
    }, 3000);
});

ch.Beep3sec.Invoke(500)
    .then(() => print(`Done after 3 sec!`));
```

</div>

#### Добавление нового таска, который сводится к вызову другого таска
<div style = "color: #555">

```js
ch.AddTask('Beep5sec', (freq) => {
    // Beep5sec возвращает вызванный таск PlaySound с определением некоторых константных свойств  
    // Последним аргументом передается идентификатор внешнего таска 
    return this.PlaySound.Invoke({ freq: freq, numRep: 1, pulseDur: 5000, prop: 0.5 }, 'Beep5sec');
    // ВАЖНО выполнить return вызова 
});

ch.Beep5sec.Invoke(500);
```

</div>


</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ClassChannelActuator]()</mark>
- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>