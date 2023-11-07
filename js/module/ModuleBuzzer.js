/**
 * @class
 * Класс ClassBuzzer реализует логику работы пьезодатчика.
 */
class ClassBuzzer extends ClassMiddleActuator {
    /**
     * @typedef BuzzerOptsType
     * @property {[Pin]} pins - массив с одним пином
     */
    /**
     * @constructor
     * @param {BuzzerOptsType} _opts 
     */
    constructor(_actuatorProps, _opts) {
        this.name = 'ClassBuzzer';                                  //переопределение имени класса
        ClassMiddleActuator.apply(this, [_actuatorProps, _opts]);   //вызов родительского конструктора

        this._Channels[0]._DataRefine.SetLim(200, 5000);

        this.InitTasks();
    }
    /*******************************************CONST********************************************/
    /**
     * @const
     * @type {number}
     * Константа ERROR_CODE_ARG_VALUE определяет код ошибки, которая может произойти
     * в случае передачи не валидных данных
     */
    static get ERROR_CODE_ARG_VALUE() { return 10; }
    /**
     * @const
     * @type {string}
     * Константа ERROR_MSG_ARG_VALUE определяет сообщение ошибки, которая может произойти
     * в случае передачи не валидных данных
     */
    static get ERROR_MSG_ARG_VALUE() { return `ERROR>> invalid data. ClassID: ${this.name}`; }
    /*******************************************END CONST*************************************** */
    /**
    * @method
    */
    InitTasks() {
        this._Channels[0].AddTask('PlaySound', (_opts) => {
            const opts = this.GetValidatedOpts(_opts);
            /*-сформировать двойной звуковой сигнал */
            const freq = opts.freq;
            let Thi = opts.pulseDur; //длительность звукового сигнала
            let Tlo = Math.floor(opts.pulseDur*(1 - opts.prop)/opts.prop); //длительность паузы
            count = opts.numRep*2;                                     //количество полупериодов(!) звукового сигнала
            let beep_flag = true;

            let beep_func = () => {
                --count;
                if (count > 0) {
                    if (beep_flag) {
                        this.Off();                                           //выключить звук
                        this._Interval = setTimeout(beep_func, Tlo);          //взвести setTimeout
                    } else {
                        this.On(0, freq);                                     //включить звук
                        this._Interval = setTimeout(beep_func, Thi);          //взвести setTimeout
                    }
                    beep_flag = !beep_flag;
                } else {
                    this.GetActiveTask().Resolve(0);               //завершение таска
                };
            };

            this.On(0, freq) //включить звуковой сигнал
            this._Interval = setTimeout(beep_func, Thi);
        });

        this._Channels[0].AddTask('BeepOnce', (freq, dur) => {
            this._Tasks.PlaySound.Invoke({ freq: freq, numRep: 1, pulseDur: dur, prop: 0.5 }, 'BeepOnce');
        });    

        this._Channels[0].AddTask('BeepTwice', (freq, dur) => {
            return this._Channels[0]._Tasks.PlaySound.Invoke({ freq: freq, numRep: 2, pulseDur: dur, prop: 0.5 }, 'BeepTwice');
        });;
    }
    //_arg - частота
    On(_chNum, _arg) {
        if (this._IsChOn[_chNum]) this.Off();
        let freq = _arg;
        analogWrite(this._Pins[0], 0.5, { freq : freq }); //включить звуковой сигнал
    }

    Off() {
        digitalWrite(this._Pins[0], 1);
        this._IsChOn[0] = false;
    }
    /**
     * @typedef TypeBuzzerStart
     * @property {Number} freq     - частота
     * @property {Number} numRep   - количество повторений [1...n]
     * @property {Number} pulseDur - длительность звучания в ms [50<=x<infinity]
     * @property {Number} prop     - пропорция ЗВУК/ТИШИНА на одном периоде [0<x<=1]
    */  

    GetValidatedOpts(_opts) {
        //проверка и валидация аргументов 
        ['freq', 'numRep', 'pulseDur', 'prop'].forEach(property => {
            if (typeof _opts[property] !== 'number' || _opts[property] < 0) throw new Error('Invalid args');
        });
        _opts.prop = E.clip(_opts.prop, 0, 1); 
        _opts.pulseDur = E.clip(_opts.pulseDur, 0, 2147483647);  //ограничение длины импульса максимальным знчением, которое может быть передано в setTimeout
        return _opts;
    }
}

exports = ClassBuzzer;
