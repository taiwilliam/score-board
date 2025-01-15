import { Data, GameScore, GameScoreDetail, GameData } from '../model'
import {
    process_record,
    timeout_record,
    foul_record,
    score_record,
    game_record,
    match_record
} from './fakeData'
import {
    mergeObjects,
    calculateMaxLeadAdvantage,
    findMaxByKey,
    calculateMaxStreak,
    calculateMaxRecoveredDeficit,
    toPercentage
} from '../helper'

export default class Analyzer {
    data = Data
    game_data = GameData

    constructor(scoreboard = null) {
        // 儲存比賽資料
        // this.process_record = scoreboard.process_record // 比賽過程記錄
        // this.timeout_record = scoreboard.timeout_record // 暫停記錄
        // this.foul_record = scoreboard.foul_record // 犯規記錄
        // this.score_record = scoreboard.score_record // 分數記錄
        // this.game_record = scoreboard.game_record // 單局分記錄
        // this.match_record = scoreboard.match_record // 局分記錄

        // 假資料
        this.process_record = process_record
        this.timeout_record = timeout_record
        this.foul_record = foul_record
        this.score_record = score_record
        this.game_record = game_record
        this.match_record = match_record

        // 預處理資料
        this.game_total_data = this.#initTotalPoint()
        this.game_time_data = this.#initGameTime()
    }

    get() {
        this.calculateAll()
        return this.data
    }

    // 計算全部
    calculateAll() {
        // 每局數據
        // 得分
        this.game_data.total_score = this.calcTotalScore()
        this.game_data.serve_points = this.calcServeScore()
        this.game_data.receive_points = this.calcReceiveScore()
        this.game_data.max_lead_advantage = this.calcMaxLeadAdvantage()
        this.game_data.max_winning_streak = this.calcMaxStreak(1)
        this.game_data.max_losing_streak = this.calcMaxStreak(0)
        this.game_data.max_recovered_deficit = this.calcMaxRecoveredDeficit()
        // 比率
        this.game_data.scoring_rate = this.calcScoringRate()
        this.game_data.serve_scoring_rate = this.calcServeScoringRate()
        this.game_data.receive_scoring_rate = this.calcReceiveScoringRate()
        // this.data.post_timeout_scoring_rate = this.calcPostTimeoutScoringRate()
        // 時間
        this.game_data.game_time = this.calcGameTime()
        this.game_data.average_scoring_point = this.calcAverageScoringTime()
        this.game_data.average_winning_time = this.calcAverageWinningTime()
        this.game_data.average_losing_time = this.calcAverageLosingTime()
        this.game_data.max_point_duration = this.calcMaxPointDuration()
        this.game_data.min_point_duration = this.calcMinPointDuration()

        // 總數據
        // 得分
        // this.data.average_game_time = this.calcAverageGameTime()
        // this.data.max_game_time = this.calcMaxGameTime()
        // this.data.min_game_time = this.calcMinGameTime()
        // this.data.average_winning_game_time = this.calcAverageWinningGameTime()
        // this.data.average_losing_game_time = this.calcAverageLosingGameTime()
        // this.data.match_duration = this.calcMatchDuration()
        // this.data.match_start_time = this.calcMatchStartTime()
        // this.data.match_end_time = this.calcMatchEndTime()
    }
    // 初始化總分
    #initTotalPoint() {
        const game_total_score = game_record.map(game =>
            mergeObjects(GameScoreDetail, { game: game.game })
        )

        this.score_record.forEach(score => {
            const game_score_index = game_total_score.findIndex(game => game.game === score.game)
            // 紀錄一般得分
            if (score.type === 'common') {
                let game_detail = game_total_score[game_score_index]
                // 參與分數
                game_detail.team_1.score += 1
                game_detail.team_2.score += 1
                // 總耗時
                const score_ms =
                    new Date(score.end_time).getTime() - new Date(score.start_time).getTime()
                game_detail.team_1.game_time += score_ms
                game_detail.team_2.game_time += score_ms

                // 得分 得分總時間、失分總時間
                if (score.winner === 1) {
                    game_detail.team_1.score_win += 1
                    game_detail.team_1.win_time += score_ms
                    game_detail.team_2.lose_time += score_ms
                }
                if (score.winner === 2) {
                    game_detail.team_2.score_win += 1
                    game_detail.team_2.win_time += score_ms
                    game_detail.team_1.lose_time += score_ms
                }
                // 發球數
                if (score.server === 1) game_detail.team_1.serve += 1
                if (score.server === 2) game_detail.team_2.serve += 1
                // 接發球數
                if (score.server === 2) game_detail.team_1.receive += 1
                if (score.server === 1) game_detail.team_2.receive += 1
                // 發球得分
                if (score.winner === 1 && score.server === 1) game_detail.team_1.serve_win += 1
                if (score.winner === 2 && score.server === 2) game_detail.team_2.serve_win += 1
                // 接發球得分
                if (score.winner === 1 && score.server === 2) game_detail.team_1.receive_win += 1
                if (score.winner === 2 && score.server === 1) game_detail.team_2.receive_win += 1
            }
        })

        return game_total_score
    }
    // 初始化單局時間
    #initGameTime() {
        const result = []

        // 按 game 分組
        const games = this.score_record.reduce((acc, record) => {
            if (!acc[record.game]) {
                acc[record.game] = { team_1: [], team_2: [] }
            }
            const time = new Date(record.end_time) - new Date(record.start_time)

            // 統一記錄到兩個隊伍中
            acc[record.game].team_1.push({
                time,
                win: record.winner === 1 ? true : false,
                server: record.server === 1 ? true : false
            })

            acc[record.game].team_2.push({
                time,
                win: record.winner === 2 ? true : false,
                server: record.server === 2 ? true : false
            })

            return acc
        }, {})

        // 格式化結果
        for (const [game, teams] of Object.entries(games)) {
            result.push({
                game: Number(game),
                ...teams
            })
        }

        return result
    }
    // 計算總分
    calcTotalScore() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: game.team_1.score_win,
            team_2: game.team_2.score_win
        }))
    }
    // 計算發球得分
    calcServeScore() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: game.team_1.serve_win,
            team_2: game.team_2.serve_win
        }))
    }
    // 計算接發球得分
    calcReceiveScore() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: game.team_1.receive_win,
            team_2: game.team_2.receive_win
        }))
    }
    // 計算最大領先優勢
    calcMaxLeadAdvantage() {
        const max_lead_advantage = []
        this.game_record.forEach(game => {
            const { team_1, team_2 } = game
            max_lead_advantage.push(calculateMaxLeadAdvantage(team_1, team_2))
        })

        return max_lead_advantage
    }
    // 計算最大連勝分
    calcMaxStreak(type = 1) {
        const max_winning_streak = []

        this.game_record.forEach(game => {
            const { team_1, team_2 } = game
            max_winning_streak.push({
                team_1: calculateMaxStreak(team_1, type),
                team_2: calculateMaxStreak(team_2, type)
            })
        })

        return max_winning_streak
    }
    // 計算最大落後追回分
    calcMaxRecoveredDeficit() {
        const max_recovered_deficit = []
        this.game_record.forEach(game => {
            const { team_1, team_2 } = calculateMaxRecoveredDeficit(game.team_1, game.team_2)
            max_recovered_deficit.push({
                game: game.game,
                team_1,
                team_2
            })
        })
        return max_recovered_deficit
    }
    // 計算得分率
    calcScoringRate() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: toPercentage(game.team_1.score_win / game.team_1.score),
            team_2: toPercentage(game.team_2.score_win / game.team_2.score)
        }))
    }
    // 計算發球得分率
    calcServeScoringRate() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: toPercentage(game.team_1.serve_win / game.team_1.serve),
            team_2: toPercentage(game.team_2.serve_win / game.team_2.serve)
        }))
    }
    // 計算接發球得分率
    calcReceiveScoringRate() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: toPercentage(game.team_1.receive_win / game.team_1.receive),
            team_2: toPercentage(game.team_2.receive_win / game.team_2.receive)
        }))
    }
    // 計算每局時間
    calcGameTime() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: game.team_1.game_time,
            team_2: game.team_2.game_time
        }))
    }
    // 計算每分平均時間
    calcAverageScoringTime() {
        return this.game_total_data.map(game => ({
            game: game.game,
            team_1: game.team_1.game_time / game.team_1.score,
            team_2: game.team_2.game_time / game.team_2.score
        }))
    }
    // 計算得分平均時間
    calcAverageWinningTime() {
        return this.game_time_data.map(game => {
            const team_1_win_time = this.#calcTotalTime(game.team_1, true)
            const team_2_win_time = this.#calcTotalTime(game.team_2, true)
            const game_data = this.#getGameTotalData(game.game)
            return {
                game: game.game,
                team_1: team_1_win_time / game_data.team_1.score_win,
                team_2: team_2_win_time / game_data.team_2.score_win
            }
        })
    }
    // 計算失分平均時間
    calcAverageLosingTime() {
        return this.game_time_data.map(game => {
            const team_1_lose_time = this.#calcTotalTime(game.team_1, false)
            const team_2_lose_time = this.#calcTotalTime(game.team_2, false)
            const game_data = this.#getGameTotalData(game.game)
            return {
                game: game.game,
                team_1: team_1_lose_time / game_data.team_2.score_win,
                team_2: team_2_lose_time / game_data.team_1.score_win
            }
        })
    }
    // 獲得單局資料
    #getGameTotalData(game) {
        return this.game_total_data.find(data => data.game === game)
    }
    // 計算總得分時間
    #calcTotalTime(data, win) {
        return data.reduce((acc, point) => {
            if (point.win === win) {
                acc += point.time
            }
            return acc
        }, 0)
    }
    // 計算最大分時間
    calcMaxPointDuration() {
      return this.game_time_data.map(game => {
        const score_time = game.team_1.reduce((max, current) => {
            return current.time > max.time ? current : max
        })
        return {
          team_1: score_time.time,
          team_2: score_time.time
        }
      })
    }
    // 計算最小分時間
    calcMinPointDuration() {
      return this.game_time_data.map(game => {
        const score_time = game.team_1.reduce((min, current) => {
            return current.time < min.time ? current : min
        })
        return {
          team_1: score_time.time,
          team_2: score_time.time
        }
      })
    }
}
