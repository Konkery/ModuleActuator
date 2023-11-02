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

        const make_sound = this.MakeSound.bind(this);            //метод оставляется в замыкании
        this.MakeSound = (_freq, _opts) => {
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
            opts.pulseDur = E.clip(opts.pulseDur, 0, 2147483647); 
            //вызов метода
            return make_sound(_freq, opts);
        }

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
        const beepOneLong = freq => {
            let args = [];
            return this.MakeSound(freq, { numRep: 1, pulseDur: 2000, prop: 0.5 });      
        };            //bind функции необходим для её дальнейшей передачи в AddTask

        const beepTwice = (freq, dur) => {
            return this.MakeSound(freq, { numRep: 2, pulseDur: dur, prop: 0.5 });
        };

        const beep10sec = freq => {
            return this.MakeSound(freq, { numRep: 1, pulseDur: 10000, prop: 0.5 });
        };

        this._Channels[0].AddTask('BeepOneLong', beepOneLong);
        this._Channels[0].AddTask('BeepTwice', beepTwice);
        this._Channels[0].AddTask('Beep10Sec', beep10sec);
    }
    //_arg - частота
    On(_chNum, _arg) {
        if (this._IsChOn[_chNum]) this.Off();
        let freq = _arg;
        // this._Freq = _arg;  
        console.log('freq = ' + freq);
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
    MakeSound(_arg, _opts) {
        // if (this._IsChOn[_chNum]) return;
        /*-сформировать двойной звуковой сигнал */
        console.log(arguments);
        let Thi = _opts.pulseDur; //длительность звукового сигнала
        let Tlo = Math.floor(_opts.pulseDur*(1 - _opts.prop)/_opts.prop); //длительность паузы
        let count = _opts.numRep*2; //количество полупериодов(!) звукового сигнала
        let beep_flag = true;
        this._IsChOn[0] = true;
        
        let beep_func = () => {
            --count;
            console.log(count, beep_flag);
            if (count > 0) {
                if (beep_flag) {
                    digitalWrite(this._Pins[0], beep_flag); //выключить звук
                    setTimeout(beep_func, Tlo); //взвести setTimeout
                } else {
                    this.On(0, _arg) //включить звук
                    setTimeout(beep_func, Thi); //взвести setTimeout
                    
                }
                beep_flag = !beep_flag;
            } else {
                console.log('DONE111');
                this._IsChOn[0] = false;
                if (this._Channels[0].GetActiveTask()) this._Channels[0].GetActiveTask().Resolve();
                
            }
        }
        this.CancelSound = () => { 
            count = 0;
            this.Off();
        }

        console.log(`12arg = ${_arg}`);
        this.On(0, _arg) //включить звуковой сигнал
        setTimeout(beep_func, Thi);
    }
}

exports = ClassBuzzer;
