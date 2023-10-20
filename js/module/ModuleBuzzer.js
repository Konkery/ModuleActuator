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
     * @property {Number} pulseDur
     * @property {Number} prop
     * @property {Number} numRep
    */

    /**
     * @method
     * @param {TypeBuzzerStart} _opts  
     */
    Start(_chNum, _arg, _opts) {
        if (this._IsChUsed[_chNum]) return;

        let opts = this.CheckStartOpts(_opts);     
        this._Freq = _arg;  
        /*-сформировать двойной звуковой сигнал */
        let Thi = opts.pulseDur; //длительность звукового сигнала
        let Tlo = Math.floor(opts.pulseDur*(1-opts.prop)/opts.prop); //длительность паузы
        this._Count = opts.numRep*2; //количество полупериодов(!) звукового сигнала
        let beep_flag = true;
        this._IsChUsed[0] = true;

        analogWrite(this._Pins[0], 0.5, { freq : this._Freq }); //включить звуковой сигнал
        let beep_func = () => {
            --this._Count;
            if (this._Count > 0) {
                if (beep_flag) {
                    digitalWrite(this._Pins[0], 1);
                    setTimeout(beep_func, Tlo); //взвести setTimeout
                } 
                else 
                {
                    analogWrite(this._Pins[0], 0.5, { freq: this._Freq }); //включить звук
                    setTimeout(beep_func, Thi); //взвести setTimeout
                }
                beep_flag = !beep_flag;
            }
            else this._IsChUsed[_chNum] = false;
        }
        setTimeout(beep_func, Thi);
    }

    Stop() {
        this._Count = 0;
        analogRead(this._Pins[0]);
        this._IsChUsed[0] = false;
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
        
        if (typeof opts.prop !== 'number' || opts.prop !== E.clip(opts.prop, 0, 1)) throw new Error('Invalid args');
        ['numRep', 'pulseDur'].forEach(k => {
            if (typeof opts[k] !== 'number' || (!Number.isInteger(opts[k])) || opts[k] < 0) throw new Error('Invalid args');
        });
        
        return opts;
    }
}

exports = ClassBuzzer;
