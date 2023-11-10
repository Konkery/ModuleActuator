<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ClassChannel
<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

### Описание
<div style = "color: #555">

Компонент [ModuleActuator](./README_MIDDLE.md), который представляет каждый отдельно взятый канал актуатора. В парадигме фрейморка EcoLight именно через объект этого класса происходит прикладная работа с актуатором. Является "синглтоном" для основного объекта актуатора. Хранит в себе ссылки на основной объект актуатора и "проброшенные" методы для работы с данным каналом актуатора, включая аксессоры. 
Также данный класс композирует в себе сервисные классы (см. [ClassDataRefine](./README_DATA_REFINE.md) и [ClassAlarms](./README_ALARMS.md)), которые безусловно используются при подаче сигнала на устройство. 
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_ThisActuator</mark> - ссылка на основной объект актуатора;
- <mark style="background-color: lightblue">_NumChannel</mark> - номер канала;
- <mark style="background-color: lightblue">_DataRefine</mark> - объект класса ClassDataRefine;
- <mark style="background-color: lightblue">_Alarms</mark> - объект класса ClassAlarms;
</div>

### Аксессоры
<div style = "color: #555">

- <mark style="background-color: lightblue">CountChannels</mark> - возвращает количество корректно инициализированных каналов типа **ClassChannelActuator**;
- <mark style="background-color: lightblue">ID</mark> - возвращает идентификатор актуатора (канала);
- <mark style="background-color: lightblue">IsOn</mark> - указывает, подается ли сигнал на канал в данный момент.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">On(_freq)</mark>
- <mark style="background-color: lightblue">Off()</mark> 
- <mark style="background-color: lightblue">ConfigureRegs()</mark>

Перечисленные выше методы ссылаются на методы, объявленные в **ClassMiddleActuator** и реализованные в прикладном классе акутатора. Их развернутое описание [по ссылке](./README_MIDDLE.md#методы).

- <mark style="background-color: lightblue">AddTask(_name, _func)</mark> - создает новый таск на основе переданной функции и помещает его в коллекцию по переданному имени. Создает одноименный геттер на данный таск;
- <mark style="background-color: lightblue">RemoveTask(_name)</mark> - удаляет таск по его идентификатору;
- <mark style="background-color: lightblue">GetActiveTask()</mark> - возвращает активный в данный момент таск либо null;
- <mark style="background-color: lightblue">InitTasks()</mark> - инициализирует базовые таски актуатора.
</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ClassTask]()</mark>
- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>