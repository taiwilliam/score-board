import { Config } from './model';
import { TEAM_NAME_TO_ID, TEAM_ID_TO_NAME } from './constants';
import Teams from './Teams';
import { validateConfig, mergeObjects, formatTime } from './helper';

// 記分板管理器
export default class Scoreboard extends Teams {
    timer = '00:00:00';
    game = 0;
    start_time = null;
    stop_time = null;
    is_paused = false; // 是否處於暫停狀態
    // 暫停用參數
    #elapsed_time = 0; // 累計的毫秒
    #paused_time = null; // 暫停時間
    #resume_time = null; // 重新開始時間
    #interval_id = null; // 計時器的 ID

    #config;
    #process_record;
    #timeout_record;
    #foul_record;
    #score_record;
    #game_record;
    #match_record;

    constructor(config) {
        super();
        this.config = this.#setConfig(config)
    }

    #setConfig(config) {
        // 驗證參數正確
        validateConfig(config);
        return mergeObjects(Config, config);
    }

    // 開始計時器
    start() {
        if (this.#interval_id) {
            throw new Error('Timer is already running.')
        }

        // 如果是暫停狀態
        if (this.is_paused) {
            return this.#resume();
        } 

        this.start_time = new Date(); // 記錄開始時間
        this.#interval_id = setInterval(() => {
            this.#elapsed_time = new Date() - this.start_time; // 計算已經過的毫秒數
            this.timer = formatTime(this.#elapsed_time); // 更新計時器
            console.log(this.timer, this.#elapsed_time);
        }, 1000); // 每秒更新一次
    }

    // 恢復計時器
    #resume() {
        if (!this.is_paused) {
            throw new Error('Timer is not paused.')
        }
        // this.#resume_time = new Date(); // 記錄恢復時間
        
        // console.log('resume', this.#resume_time)
        this.#interval_id = setInterval(() => {
            this.#elapsed_time = new Date() - this.start_time - this.#paused_time; // 計算已經過的毫秒數
            console.log(this.#elapsed_time)
            this.updateTimer()
            console.log(this.timer, this.#elapsed_time);

        }, 1000); // 每秒更新一次
    }

    // 暫停計時器
    pause() {
        if (!this.#interval_id) {
            throw new Error('Timer is not running.')
        }
        // 紀錄暫停
        this.is_paused = true; // 設置為暫停狀態
        this.#paused_time = new Date(); // 記錄暫停時間

        // 暫停計時器
        clearInterval(this.#interval_id); // 停止計時器
        this.#interval_id = null; // 清空計時器 ID

        // 儲存暫停時間
        this.#elapsed_time = new Date() - this.start_time; // 記錄暫停時的累計時間
        this.updateTimer() // 更新計時器

        console.log(this.timer, this.#elapsed_time);
    }


    // 停止計時器
    stop() {
        if (!this.#interval_id) {
            throw new Error('Timer is not running.')
        }

        clearInterval(this.#interval_id); // 停止計時器
        this.#interval_id = null; // 清空計時器 ID
        this.stop_time = new Date(); // 記錄停止時間
        this.resetPause(); // 重置暫停

        console.log(this.timer)
    }

    // 重置暫停
    resetPause() {
        this.#resume_time = null; // 重置暫停時間
        this.is_paused = false; // 重置暫停狀態
    }

    // 更新比賽時間
    updateTimer() {
        this.timer = formatTime(this.#elapsed_time); // 更新計時器
    }
}
