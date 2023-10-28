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

        (() => {
            const makeSound = this.MakeSound.bind(this);            //метод оставляется в замыкании
            this.MakeSound = (_chNum, _freq, _opts) => {
                //проверка и валидация аргументов 
                const opts = {
                    pulseDur : _opts.pulseDur || 100,
                    numRep   : _opts.numRep   || 1,
                    prop     : _opts.prop || 0.5
                };
                ['numRep', 'pulseDur', 'prop'].forEach(property => {
                    if (typeof opts[property] !== 'number' || opts[property] < 0) throw new Error('Invalid args');
                });
                opts.prop = E.clip(opts.prop, 0, 1);  
                //вызов метода
                return makeSound(0, _freq, opts);
            }
        })();

        this.InitBaseTasks();
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
    InitBaseTasks() {
        const beepOneLong = (freq => {
            let args = [0, freq, { numRep: 1, pulseDur: 2000, prop: 0.5} ];
            return this.MakeSound.apply(this, args);
        
        }).bind(this);            //bind функции необходим для её дальнейшей передачи в AddTask

        const beepTwoTimes = (freq => {
            let args = [0, freq, { numRep: 2, pulseDur: 200, prop: 0.5} ];
            return this.MakeSound.apply(this, args);
        }).bind(this);

        this._Channels[0].AddTask('BeepOneLong', beepOneLong);
        this._Channels[0].AddTask('BeepTwice', beepTwoTimes);
    }
    //_arg - частота
    On(_chNum, _arg) {
        if (this._IsChOn[_chNum]) this.Off();

        this._Freq = _arg;  
        analogWrite(this._Pins[0], 0.5, { freq : this._Freq }); //включить звуковой сигнал
    }

    Off() {
        digitalWrite(this._Pins[0], 1);
        this._IsChOn[0] = false;
    }
    /**
     * @method
     * Метод проверяет объект с вх.параметрами на валидность и возвращает его. 
     * @param {TypeBuzzerStart} _opts 
     * @returns {Object}
     */
    CheckStartOpts(_opts) {
        const opts = {
            pulseDur : _opts.pulseDur || 100,
            numRep   : _opts.numRep   || 1,
            prop     : _opts.prop || 0.5
        }
        
        opts.pulseDur = E.clip(opts.pulseDur, 0, 2147483647);

        if (typeof opts.prop !== 'number' || opts.prop !== E.clip(opts.prop, 0, 1)) throw new Error('Invalid args');
        if (typeof opts.numRep !== 'number' || opts.numRep < 0 ||
            typeof opts.pulseDur !== 'number' || opts.pulseDur < 0) throw new Error('Invalid args');
        
        return opts;
    }
    /**
     * @typedef TypeBuzzerStart
     * @property {Number} numRep   - количество повторений [1...n]
     * @property {Number} pulseDur - длительность звучания в ms [50<=x<infinity]
     * @property {Number} prop    - пропорция ЗВУК/ТИШИНА на одном периоде [0<x<=1]
    */  
    /**
     * 
     * @param {Number} _chNum - номер канала (всегда 0)
     * @param {Number} _arg - частота
     * @param {TypeBuzzerStart} _opts 
     * @returns 
     */
    MakeSound(_chNum, _arg, _opts) {
        console.log('args');
        console.log(arguments);
        if (this._IsChOn[_chNum]) return;

        //let opts = this.CheckStartOpts(_opts);     

        /*-сформировать двойной звуковой сигнал */
        let Thi = _opts.pulseDur; //длительность звукового сигнала
        let Tlo = Math.floor(_opts.pulseDur*(1 - _opts.prop)/_opts.prop); //длительность паузы
        let count = _opts.numRep*2; //количество полупериодов(!) звукового сигнала
        let beep_flag = true;
        this._IsChOn[0] = true;

        this.On(0, _arg) //включить звуковой сигнал
        let beep_func = () => {
            --count;
            console.log(count);
            if (count > 0) {
                if (beep_flag) {
                    this.Off();
                    setTimeout(beep_func, Tlo); //взвести setTimeout
                } 
                else 
                {
                    this.On(0, _arg) //включить звук
                    setTimeout(beep_func, Thi); //взвести setTimeout
                }
                beep_flag = !beep_flag;
            }
            else this._IsChOn[_chNum] = false;
        }
        setTimeout(beep_func, Thi);
    }
}

exports = ClassBuzzer;
