/**
 * @class
 * Класс ClassBuzzer реализует логику работы пьезодатчика.
 * Для работы класса требуется подключить модуль ModuleAppMath, где 
 * добавляется функция проверки на целочисленность
 */
class ClassBuzzer extends ClassMiddleActuator {
    /**
     * @constructor
     * @param {Object} _opt - объект класса Pin
     */
    constructor(_actuatorProps, _opts) {
        this.name = 'ClassBuzzer'; //переопределяем имя типа
        ClassMiddleActuator.apply(this, [_actuatorProps, _opts]);

        this._Channels[0]._DataRefine.SetLim(200, 2500);
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
    /*******************************************END CONST****************************************/
    /**
     * 
     * @typedef TypeBuzzerStart
     * @property {Number} [freq]
     * @property {Number} pulseDur
     * @property {Number} prop
     * @property {Number} numRep
    */

    /**
     * @method
     * @param {TypeBuzzerStart} _opts  
     */
    Start(_chNum, _arg, _opts) {
        /*проверить переданные аргументы на валидность*/
        let opts = this.CheckStartOpts(_opts);      
        this._Freq = _arg;  
        /*-сформировать двойной звуковой сигнал */
        let Thi = opts.pulseDur; //длительность звукового сигнала
        let Tlo = Math.floor(opts.pulseDur*(1-opts.prop)/opts.prop); //длительность паузы
        this._Count = opts.numRep*2; //количество полупериодов(!) звукового сигнала
        let beep_flag = true;

        analogWrite(this._Pins[0], _arg, { freq : this._Freq }); //включить звуковой сигнал
        let beep_func = () => {
            --this._Count;
            if (this._Count > 0) {
                if (beep_flag) {
                    digitalWrite(this._Pins[0], 1);
                        setTimeout(beep_func, Tlo); //взвести setTimeout
                } else {
                    analogWrite(this._Pins[0], this.Ch0_Value, { freq: this._Freq }); //включить звук
                        setTimeout(beep_func, Thi); //взвести setTimeout
                }
                beep_flag = !beep_flag;
            }
        }
        setTimeout(beep_func, Thi);
    }

    Stop() {
        this._Count = 0;
    }

    ChangeFreq(_freq) {
        if (typeof _freq === 'number') { //TODO: check values properly
            this._Freq = _freq;
            return true;
        }
        return false;
    }
    /**
     * 
     * @param {*} _opts 
     * @returns {Object}
     */
    CheckStartOpts(_opts) {
        const opts = {
            pulseDur : _opts.pulseDur || 100,
            numRep   : _opts.numRep   || 1,
            prop     : _opts.prop || 0.5
        }
        
        /*проверить переданные аргументы  на валидность*/
        if (!(typeof (opts.pulseDur) === 'number')   ||
            !(typeof (opts.numRep) === 'number')     ||
            !(typeof (opts.freq) === 'number')       ||
            !(typeof (opts.prop) === 'number')       ||
            !(Number.isInteger(opts.pulseDur))       ||
            !(Number.isInteger(opts.numRep))) {   
    
                // throw new ClassAppError(ClassBuzzer.ERROR_MSG_ARG_VALUE,
                //                 ClassBuzzer.ERROR_CODE_ARG_VALUE);
                throw new Error('Invalid args');
            
        }
        return opts;
    }
}

exports = ClassBuzzer;
