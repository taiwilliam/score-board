import { Config, ScoreRecord, GameRecord, MatchRecord, ProcessRecord } from './model'
import { TEAM_NAME_TO_ID, TEAM_ID_TO_NAME } from './constants'
import Teams from './Teams'
import {
    validateConfig,
    mergeObjects,
    formatTime,
    validateTeamId,
    validateScoreType,
    validateProcessType,
    getTotalScore
} from './helper'

// 記分板管理器
export default class Scoreboard extends Teams {
    timer = '00:00:00'
    current_game = 0 // 第幾局
    start_time = null
    stop_time = null
    is_paused = false // 是否處於暫停狀態
    // 暫停用參數
    elapsed_ms = 0 // 累計的毫秒
    elapsed_time = null // 暫停時間
    // #resume_time = null; // 重新開始時間
    interval_id = null // 計時器的 ID

    config
    process_record = [] // 比賽過程記錄
    timeout_record = [] // 暫停記錄
    foul_record = [] // 犯規記錄
    score_record = [] // 分數記錄
    game_record = [] // 單局分記錄
    match_record = [] // 局分記錄

    constructor(config) {
        super()
        this.config = this.#setConfig(config)
    }

    #setConfig(config) {
        // 驗證參數正確
        validateConfig(config)
        return mergeObjects(Config, config)
    }

    // 開始計時器
    start() {
        if (this.interval_id) {
            throw new Error('Timer is already running.')
        }
        this.elapsed_time = new Date() // 記錄開始時間
        this.start_time = new Date() // 記錄比賽開始時間
        this.is_paused = false // 設置為開始狀態
        this.nextGame() // 設置當前局數

        this.startTimer() // 開始記時
    }

    // 暫停計時器
    pause() {
        if (!this.interval_id) {
            throw new Error('Timer is not running.')
        }
        this.is_paused = true // 設置為暫停狀態
        this.updateTimer() // 更新計時器
        this.destroyInterval() // 銷毀計時器
    }

    // 停止計時器
    stop() {
        this.stop_time = new Date() // 記錄停止時間
        this.updateTimer() // 更新計時器
        this.destroyInterval() // 銷毀計時器
        this.is_paused = false
    }

    // 銷毀計時器
    destroyInterval() {
        clearInterval(this.interval_id) // 停止計時器
        this.interval_id = null // 清空計時器 ID
    }

    // 開始計時器
    startTimer() {
        this.interval_id = setInterval(() => this.updateTimer(), 1000)
    }

    // 更新比賽時間
    updateTimer() {
        const elapsed_ms = new Date() - this.elapsed_time // 計算已經過的毫秒數 現在時間 - 開始時間
        this.elapsed_ms += elapsed_ms // 累積經過的毫秒數
        this.timer = formatTime(this.elapsed_ms) // 更新時間顯示
        this.elapsed_time = new Date() // 更新開始計時時間
    }

    // 推進局數
    nextGame() {
        this.current_game += 1
    }

    // 新增分數
    addScore(team_id, score = 1) {
        const score_record = this.createScoreRecord('common', team_id, score)
        this.score_record.push(score_record)
        const game_record = this.createGameRecord()
        this.game_record.push(game_record)
        const match_record = this.createMatchRecord()
        this.match_record.push(match_record)
        const process_record = this.createProcessRecord('score')
        this.process_record.push(process_record)
    }

    // 創建進程記錄
    createProcessRecord(type) {
        validateProcessType(type)
        return mergeObjects(ProcessRecord, {
            id: this.process_record.length,
            game: this.current_game,
            type: type, // 進程類型 score、timeout、foul
            score_record_id: this.getLatestRecord('score')?.id,
            timeout_record_id: this.getLatestRecord('timeout')?.id,
            foul_record_id: this.getLatestRecord('foul')?.id
        })
    }

    // 創建局分記錄
    createMatchRecord() {
        return mergeObjects(MatchRecord, {
            id: this.match_record.length,
            game: this.current_game,
            team_1: this.getMatchScore(1),
            team_2: this.getMatchScore(2)
        })
    }

    // 創建單局分記錄
    createGameRecord() {
        return mergeObjects(GameRecord, {
            id: this.game_record.length,
            game: this.current_game,
            team_1: this.getGameScore(1),
            team_2: this.getGameScore(2)
        })
    }

    // 創建得分紀錄
    createScoreRecord(type, team_id, score = 1) {
        validateScoreType(type)
        return mergeObjects(ScoreRecord, {
            id: this.score_record.length,
            game: this.current_game,
            type: type, // 得分方式(正常得分、犯規、暫停) common、foul
            winner: team_id, // 1 or 2 勝利者
            score: score, // 得分
            server: this.getServer(), // 發球方
            start_time: this.getScoreStartTime(), // 開始時間(一般來說是上一分的得分時間，但也有可能會有暫停的情況)
            end_time: new Date // 得分時間(翻下計分牌的時間)
        })
    }

    // 獲得得分時間
    getScoreStartTime() {
        // 若尚未有任何紀錄，代表為第一局第一分
        if (this.score_record.length === 0) {
            return this.start_time
        }else{
            return this.score_record[this.score_record.length - 1].end_time
        }
    }

    // 獲得發球方
    getServer() {
        console.log(this.game_record)
        // 若尚未有任何紀錄，代表為第一局第一分
        if (this.game_record.length === 0) {
            return this.config.server
        }else{
            console.log('getServer')
        }

        return
    }

    // 獲得單局分
    getGameScore(team_id) {
        validateTeamId(team_id)
        const game_score = []

        this.score_record.forEach(score_record => {
            const score = score_record.winner === team_id ? 1 : 0
            game_score.push(score)
        })

        return game_score
    }

    // 獲得局分
    getMatchScore(team_id) {
        validateTeamId(team_id)
        const match_score = []
        const opponent_id = this.getOpponentId(team_id)
        const team_key = TEAM_ID_TO_NAME[team_id]
        const opponent_key = TEAM_ID_TO_NAME[opponent_id]
        
        this.game_record.forEach(record => {
            const total_score = getTotalScore(record[team_key])
            const opponent_total_score = getTotalScore(record[opponent_key])

            // 一般11分獲勝
            if(!this.config.deuce && total_score === 11){
                match_score.push(1)
            }

            // deuce 情況下則要多贏2分
            if(this.config.deuce && total_score >= 11 && total_score - opponent_total_score >= 2){
                match_score.push(1)
            }
        })

        return match_score
    }

    // 獲得對手ID
    getOpponentId(team_id) {
        validateTeamId(team_id)
        return team_id === 1 ? 2 : 1
    }

    // 獲得最新記錄
    getLatestRecord(type) {
        validateProcessType(type)

        if(type === 'score') {
            return this.score_record[this.score_record.length - 1]
        }

        if(type === 'timeout') {
            return this.timeout_record[this.timeout_record.length - 1]
        }

        if(type === 'foul') {
            return this.foul_record[this.foul_record.length - 1]
        }

        return null
    }
}
