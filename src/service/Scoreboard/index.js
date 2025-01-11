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
    elapsed_ms = 0; // 累計的毫秒
    elapsed_time = null; // 暫停時間
    // #resume_time = null; // 重新開始時間
    interval_id = null; // 計時器的 ID

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
        if (this.interval_id) {
            throw new Error('Timer is already running.')
        }
        this.elapsed_time = new Date(); // 記錄開始時間
        this.start_time = new Date(); // 記錄比賽開始時間
        this.is_paused = false; // 設置為開始狀態

        this.startTimer(); // 開始記時
    }

    // 暫停計時器
    pause() {
        if (!this.interval_id) {
            throw new Error('Timer is not running.')
        }
        this.is_paused = true; // 設置為暫停狀態
        this.updateTimer() // 更新計時器
        this.destroyInterval(); // 銷毀計時器
    }


    // 停止計時器
    stop() {
        this.stop_time = new Date(); // 記錄停止時間
        this.updateTimer() // 更新計時器
        this.destroyInterval(); // 銷毀計時器
        this.is_paused = false;
    }

    // 銷毀計時器
    destroyInterval() {
        clearInterval(this.interval_id); // 停止計時器
        this.interval_id = null; // 清空計時器 ID
    }

    // 開始計時器
    startTimer() {
        this.interval_id = setInterval(() => this.updateTimer(), 1000);
    }

    // 更新比賽時間
    updateTimer() {
        const elapsed_ms = new Date() - this.elapsed_time; // 計算已經過的毫秒數 現在時間 - 開始時間
        this.elapsed_ms += elapsed_ms; // 累積經過的毫秒數
        this.timer = formatTime(this.elapsed_ms); // 更新時間顯示
        this.elapsed_time = new Date(); // 更新開始計時時間
    }
}
