import { Config, ScoreRecord, GameRecord, MatchRecord, ProcessRecord } from './model'
import { UPDATE_INTERVAL, TEAM_ID_TO_NAME } from './constants'
import Teams from './Teams'
import Analyzer from './Analyzer'
import {
    validateConfig,
    mergeObjects,
    formatTime,
    validateTeamId,
    validateScoreType,
    validateProcessType,
    getTotalScore,
    purePush,
    calculateCurrentServer,
    isGameFinish,
    isMatchFinish
} from './helper'

// 記分板管理器
export default class Scoreboard extends Teams {
    timer = '00:00:00'
    current_game = 0 // 第幾局
    current_server = null // 發球方
    start_time = null // 賽事開始時間
    stop_time = null // 賽事結束時間
    is_paused = false // 是否處於暫停狀態
    is_pre_finish = false // 是否處於比賽結束前狀態
    is_game_interval = false // 是否處於比賽局間間隔
    // 暫停用參數
    elapsed_ms = 0 // 累計的毫秒
    elapsed_time = null // 暫停時間
    interval_id = null // 計時器的 ID

    config
    process_record = [] // 比賽過程記錄
    timeout_record = [] // 暫停記錄
    foul_record = [] // 犯規記錄
    score_record = [] // 分數記錄
    game_record = [] // 單局分記錄
    match_record = {} // 局分記錄

    constructor(config) {
        super()
        this.config = this.#setConfig(config)
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
        this.updateServer() // 更新發球方

        this.startTimer() // 開始記時
    }

    // 恢復計時器
    resume() {
        if (!this.is_paused) {
            throw new Error('Timer is not paused.')
        }
        this.elapsed_time = new Date() // 記錄開始時間
        this.is_paused = false // 設置為開始狀態

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

    // 新增分數
    addScore(team_id, score = 1) {
        if (this.is_paused) {
            throw new Error('Timer is paused.')
        }
        // 更新分數
        const score_record = this.createScoreRecord('common', team_id, score)
        this.score_record = purePush(this.score_record, score_record)

        // 更新局分
        this.updateGameRecord()

        // 更新發球方
        this.updateServer()

        // 更新score_record 發球方
        this.updateScoreRecord(score_record.id, { server: this.current_server })

        // 更新進程
        this.updateProcessRecord()

        // 處理單局結束
        this.handleGameFinish()
    }

    // 上一步
    prev() {
        // 復原時間
        this.resumeTimer()

        if (this.process_record.length === 0) {
            return
        }

        // 刪除進程記錄
        this.deleteProcessRecord()

        // 刪除得分紀錄
        this.deleteScoreRecord()

        // 更新局分
        this.updateGameRecord()

        // 更新發球方
        this.updateServer()

        // 如果在局間隔則恢復計時器
        if (this.is_game_interval || this.is_pre_finish) {
            this.clearPause()
        }
    }

    // 完成比賽
    finish() {
        // 更新局數
        this.updateMatchRecord()

        // 更新局分
        this.updateGameRecord()

        // 更新發球方
        this.updateServer()

        // 將資料傳入分析器
        const analyzer = new Analyzer(this)
    }

    // 清除暫停
    clearPause() {
        this.is_paused = false
        this.is_game_interval = false
        this.is_pre_finish = false
        this.startTimer()
    }

    // 開始下一局
    startNextGame() {
        // 下一局
        this.nextGame()

        // 更新局數
        this.updateMatchRecord()

        // 更新局分
        this.updateGameRecord()

        // 更新發球方
        this.updateServer()

        // 清除暫停
        this.clearPause()
    }

    // 創建設定檔
    #setConfig(config) {
        // 驗證參數正確
        validateConfig(config)
        return mergeObjects(Config, config)
    }

    // 更新局分
    updateGameRecord() {
        const game_record = this.createGameRecord()
        this.storeGameRecord(game_record)
    }

    // 更新局數
    updateMatchRecord() {
        const match_record = this.createMatchRecord()
        this.storeMatchRecord(match_record)
    }

    // 更新進程
    updateProcessRecord() {
        const process_record = this.createProcessRecord('score')
        this.storeProcessRecord(process_record)
    }

    // 刪除得分紀錄 預設刪除最後一筆
    deleteScoreRecord(score_record_id = this.getLatestRecord('score').id) {
        let new_score_record = [...this.score_record]
        new_score_record = new_score_record.filter(record => {
            // 不得跨局刪除
            if (record.game !== this.current_game) {
                return true
            }
            return record.id !== score_record_id
        })
        this.score_record = new_score_record
    }

    // 刪除進程紀錄 預設刪除最後一筆
    deleteProcessRecord(process_record_id = this.getLatestRecord('process').id) {
        let new_process_record = [...this.process_record]
        new_process_record = new_process_record.filter(record => {
            // 不得跨局刪除
            if (record.game !== this.current_game) {
                return true
            }
            return record.id !== process_record_id
        })
        this.process_record = new_process_record
    }

    // 獲取分數記錄
    getScoreRecord(score_record_id) {
        return this.score_record.find(record => record.id === score_record_id)
    }

    // 獲取進程記錄
    getProcessRecord(process_record_id) {
        return this.process_record.find(record => record.id === process_record_id)
    }

    // 銷毀計時器
    destroyInterval() {
        clearInterval(this.interval_id) // 停止計時器
        this.interval_id = null // 清空計時器 ID
    }

    // 開始計時器
    startTimer() {
        this.interval_id = setInterval(() => this.updateTimer(), UPDATE_INTERVAL)
    }

    // 恢復計時器
    resumeTimer() {
        const elapsed_ms = this.getTotalScoreTime()
        this.elapsed_ms = elapsed_ms
        this.timer = formatTime(this.elapsed_ms) // 更新時間顯示
    }

    // 獲得所有分數耗時
    getTotalScoreTime() {
        let elapsed_ms = 0
        this.score_record.forEach(score_record => {
            elapsed_ms += score_record.end_time - score_record.start_time
        })
        return elapsed_ms
    }

    // 更新比賽時間
    updateTimer() {
        const elapsed_ms = new Date() - this.elapsed_time // 計算已經過的毫秒數 現在時間 - 開始時間
        this.elapsed_ms += elapsed_ms // 累積經過的毫秒數
        this.timer = formatTime(this.elapsed_ms) // 更新時間顯示
        this.elapsed_time = new Date() // 更新開始計時時間
    }

    // 處理局數結束
    handleGameFinish() {
        // 單局未結束則跳過
        if (!this.isGameFinish()) {
            return
        }

        // 若為最後一局
        if (this.isMatchFinish()) {
            this.handleMatchFinish()
            return
        }

        // 局間間隔
        this.is_game_interval = true
        // 暫停計時器
        this.pause()
    }

    // 處理賽事結束
    handleMatchFinish() {
        // 設置為比賽結束前狀態
        this.is_pre_finish = true

        // 暫停計時器
        this.pause()
    }

    // 單局是否已結束
    isGameFinish() {
        const { team_1, team_2 } = this.getGameTotalScore()
        return isGameFinish(team_1, team_2, this.config.score, this.config.deuce)
    }

    // 賽事是否已結束
    isMatchFinish() {
        const { team_1, team_2 } = this.getMatchTotalScore()
        // 有任一隊伍達到勝利局數 代表完賽
        return isMatchFinish(team_1, team_2, this.config.win)
    }

    // 推進局數
    nextGame() {
        this.current_game += 1
    }

    // 更新發球方
    updateServer() {
        const opponent_id = this.getOpponentId(this.config.server)
        // 偶數局
        const even_game = this.current_game % 2 === 0
        // 該局先發球方 (偶數局為對方發球)
        const starting_server = even_game ? opponent_id : this.config.server
        // 獲得隊伍該局總得分
        const { team_1, team_2 } = this.getGameTotalScore()
        const server = calculateCurrentServer(
            starting_server,
            team_1,
            team_2,
            this.config.score
        )

        this.current_server = server
    }

    // 獲得單局紀錄
    getGameRecord(game = this.current_game) {
        return this.game_record.find(record => record.game === game)
    }

    // 獲得單局總分
    getGameTotalScore(game = this.current_game) {
        const game_record = this.getGameRecord(game)
        const team_1_score = game_record?.team_1 ? game_record.team_1 : []
        const team_2_score = game_record?.team_2 ? game_record.team_2 : []
        const team_1_total_score = getTotalScore(team_1_score)
        const team_2_total_score = getTotalScore(team_2_score)
        return {
            team_1: team_1_total_score,
            team_2: team_2_total_score
        }
    }

    // 獲得場總分
    getMatchTotalScore() {
        const match_score = {
            team_1: 0,
            team_2: 0
        }
        this.game_record.forEach(record => {
            const { team_1, team_2 } = this.getGameTotalScore(record.game)
            const is_game_finish = isGameFinish(
                team_1,
                team_2,
                this.config.score,
                this.config.deuce
            )
            if (is_game_finish) {
                const winner_team = team_1 > team_2 ? 'team_1' : 'team_2'
                match_score[winner_team] += 1
            }
        })

        return match_score
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
            server: null, // 發球方
            start_time: this.getScoreStartTime(), // 開始時間(一般來說是上一分的得分時間，但也有可能會有暫停的情況)
            end_time: this.getScoreEndTime() // 得分時間(翻下計分牌的時間)
        })
    }

    // 修改得分紀錄
    updateScoreRecord(score_record_id, obj) {
        const score_record_index = this.score_record.findIndex(
            record => record.id === score_record_id
        )
        if (score_record_index === -1) {
            throw new Error('Score record not found.')
        }
        const new_score_record = mergeObjects(this.score_record[score_record_index], obj)
        this.score_record[score_record_index] = new_score_record
    }

    // 儲存單局分記錄
    storeGameRecord(game_record) {
        const game_index = this.game_record.findIndex(record => record.game === game_record.game)

        if (game_index === -1) {
            this.game_record = purePush(this.game_record, game_record)
        } else {
            const new_game_record = [...this.game_record]
            new_game_record[game_index] = game_record
            this.game_record = new_game_record
        }
    }

    // 儲存局分記錄
    storeMatchRecord(match_record) {
        this.match_record = match_record
    }

    // 儲存進程記錄
    storeProcessRecord(process_record) {
        this.process_record = purePush(this.process_record, process_record)
    }

    // 獲得得分時間
    getScoreStartTime() {
        // 若尚未有任何紀錄，代表為第一局第一分
        if (this.score_record.length === 0) {
            return this.start_time
        } else {
            return this.score_record[this.score_record.length - 1].end_time
        }
    }

    // 獲得得分結束時間
    getScoreEndTime() {
        const start_time = this.start_time.getTime()
        const end_time = new Date(start_time + this.elapsed_ms)

        return end_time
    }

    // 獲得單局分
    getGameScore(team_id) {
        validateTeamId(team_id)
        const game_score = []
        this.score_record.forEach(score_record => {
            // 若不是該局
            if (score_record.game !== this.current_game) {
                return
            }
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

            if (
                isGameFinish(
                    total_score,
                    opponent_total_score,
                    this.config.score,
                    this.config.deuce
                )
            ) {
                match_score.push(total_score > opponent_total_score ? 1 : 0)
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

        if (type === 'score') {
            return this.score_record[this.score_record.length - 1]
        }

        if (type === 'timeout') {
            return this.timeout_record[this.timeout_record.length - 1]
        }

        if (type === 'foul') {
            return this.foul_record[this.foul_record.length - 1]
        }

        if (type === 'process') {
            return this.process_record[this.process_record.length - 1]
        }

        return null
    }
}
