<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ClassDataRefine
<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

### Описание
<div style = "color: #555">

Сервисный класс из стека [ModuleActuator](README.md). Назначен для обеспечении математической обработки вх.сигнала актуатора. Включает в себя:
- Супрессию входных значений;
- Трансформацию линейной функцией.
Объект класса автоматически инициализируется в поле *_DataRefine* класса [ClassChannelActuator](./README_CHANNEL.md). Методы для преобразования данных вызываются из декоратора к методу *On(_freq)* класса канала.
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Values</mark> - массив с используемыми коэффициентами;
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">SetOutLim(_limLow, _limHigh)</mark> - устанавливает значения ограничителей входных значений;
- <mark style="background-color: lightblue">SupressOutValue(_val)</mark> - возвращает число, прошедшее через супрессорную функцию;
- <mark style="background-color: lightblue">SetTransmissionOut(_k, _b)</mark> - устанавливает коэффициенты k и b трансформирующей функции канала;
- <mark style="background-color: lightblue">TransformOutValue(_val)</mark> - возвращает значение, прошедшее через трансформирующую функцию.

<div align='left'>
    <img src="./res/math.png" alt="Image not found">
</div>

<div align='left'>
    <img src="./res/data_transformation.png" alt="Image not found">
</div>

</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>