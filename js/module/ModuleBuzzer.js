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

        const make_sound = this.MakeSound.bind(this);               //сохранение изначального метода 
        this.MakeSound = (_freq, _opts) => {                        //создание декоратора к методу для валидации его аргументов
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
            opts.pulseDur = E.clip(opts.pulseDur, 0, 2147483647);  //ограничение длины импульса максимальным знчением, которое может быть передано в setTimeout
            //вызов метода
            return make_sound(_freq, opts);
        }

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
        const beep_once = function(freq, dur) {
            // console.log(arguments[arguments.length-1];
            return this.MakeSound(freq, { numRep: 1, pulseDur: (dur || 1000), prop: 0.5 });      
        };    

        const beep_twice = (freq, dur) => {
            return this.MakeSound(freq, { numRep: 2, pulseDur: (dur || 500), prop: 0.5 });
        };

        const beep_5sec = freq => {
            return this.MakeSound(freq, { numRep: 1, pulseDur: 5000, prop: 0.5 });
        };

        this._Channels[0].AddTask('BeepOneLong', beep_once);
        this._Channels[0].AddTask('BeepTwice', beep_twice);
        this._Channels[0].AddTask('Beep5Sec', beep_5sec);
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
     * @property {Number} numRep   - количество повторений [1...n]
     * @property {Number} pulseDur - длительность звучания в ms [50<=x<infinity]
     * @property {Number} prop    - пропорция ЗВУК/ТИШИНА на одном периоде [0<x<=1]
    */  
    /**
     * 
     * @param {Number} _arg - частота
     * @param {TypeBuzzerStart} _opts 
     * @returns 
     */
    MakeSound(_arg, _opts, _task) {
        /*-сформировать двойной звуковой сигнал */
        let Thi = _opts.pulseDur; //длительность звукового сигнала
        let Tlo = Math.floor(_opts.pulseDur*(1 - _opts.prop)/_opts.prop); //длительность паузы
        this._Count = _opts.numRep*2;                                     //количество полупериодов(!) звукового сигнала
        let beep_flag = true;
        this._IsChOn[0] = true;
        
        let beep_func = () => {
            --this._Count;
            if (this._Count > 0) {
                if (beep_flag) {
                    digitalWrite(this._Pins[0], beep_flag);               //выключить звук
                    setTimeout(beep_func, Tlo);                           //взвести setTimeout
                } else {
                    this.On(0, _arg)                                      //включить звук
                    setTimeout(beep_func, Thi);                           //взвести setTimeout
                    
                }
                beep_flag = !beep_flag;
            } else {
                this._IsChOn[0] = false;
                if (_task) _task.Resolve(0);
            }
        }

        this.On(0, _arg) //включить звуковой сигнал
        setTimeout(beep_func, Thi);
    }

    Cancel() { 
        this._Count = 0;
        this.Off();
    }
}

exports = ClassBuzzer;
