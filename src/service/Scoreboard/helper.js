// 參數驗證
export const validateConfig = config => {
    if (!(typeof config === 'object')) {
        throw new Error(
            'config is object ex: {win: 1|2|3|4|5, deuce: boolean, server: 1|2, score: number, timeout_count: number, timeout_time: number, }'
        )
    }
    // 有win 且不是 1 ~ 5
    if ('win' in config && !([1, 2, 3, 4, 5].indexOf(config.win) >= 0)) {
        throw new Error('win is 1 to 5')
    }
    // 有score 且不是正整數
    if ('score' in config && !(typeof config.score === 'number' && config.score > 0)) {
        throw new Error('score is a positive integer')
    }
    // 有timeout_count 且不是正整數
    if (
        'timeout_count' in config &&
        !(typeof config.timeout_count === 'number' && config.timeout_count >= 0)
    ) {
        throw new Error('timeout_count is a positive integer')
    }
    // 有timeout_time 且不是正整數
    if (
        'timeout_time' in config &&
        !(typeof config.timeout_time === 'number' && config.timeout_time > 0)
    ) {
        throw new Error('timeout_time is a positive integer')
    }
    // 有deuce 且不是布林
    if ('deuce' in config && !(typeof config.deuce === 'boolean')) {
        throw new Error('deuce is a boolean')
    }
    // 有server 且不為 1 或 2
    if ('有server' in config && !(config.server === 1 || config.server === 2)) {
        throw new Error('server is 1 or 2')
    }
}

// 驗證隊伍
export const validateTeam = (team_id, team) => {
    validateTeamId(team_id)
    // team 必須是物件
    if (!(typeof team === 'object')) {
        throw new Error('team is object ex: {name: string, photo: string}')
    }
    // name 必須存在且是字串
    if (!('name' in team && typeof team.name === 'string')) {
        throw new Error('team name is required')
    }
    // 有photo時 必須是字串
    if ('photo' in team && !(typeof team.photo === 'string')) {
        throw new Error('team photo is string')
    }
}

export const validateTeamId = team_id => {
    if (!(team_id === 1 || team_id === 2)) {
        throw new Error('team_id is 1 or 2')
    }
}

// 合併物件 將incoming的值覆蓋container的值 只有屬性存在才會覆蓋
// container 容器對象
// incoming 來源對象
export const mergeObjects = (container, incoming) => {
    const result = JSON.parse(JSON.stringify(container)) // 複製容器對象
    for (const key in container) {
        if (incoming.hasOwnProperty(key)) {
            result[key] = incoming[key] // 覆蓋相同屬性的值
        }
    }
    return result
}

// 格式化時間：將毫秒轉換為 HH:MM:SS
export const formatTime = ms => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
    const seconds = String(totalSeconds % 60).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
}

export const validateScoreType = type => {
    if (!(type === 'common' || type === 'foul')) {
        throw new Error('type is common or foul')
    }
}

export const validateProcessType = type => {
    if (!(type === 'score' || type === 'timeout' || type === 'foul' || type === 'process')) {
        throw new Error('type is score, timeout or foul')
    }
}

export const getTotalScore = score_array => {
    return score_array.reduce((sum, value) => sum + value, 0)
}

export const purePush = (array, value) => {
    return [...array, value]
}

/**
 * 計算當前發球方
 * @param {number} starting_server - 第一局的發球方 (1 或 2)。
 * @param {number} score_1 - 玩家 1 的目前得分。
 * @param {number} score_2 - 玩家 2 的目前得分。
 * @param {number} max_score - 每局的最大得分（例如 7、11）。
 * @returns {number} 當前的發球方 (1 或 2)。
 */
export const calculateCurrentServer = (starting_server, score_1, score_2, max_score) => {
    const totalScore = score_1 + score_2 - 1 // 總得分（從 0 開始） 0,[1,2],[3,4],[5,6]...
    const opponent_id = starting_server === 1 ? 2 : 1

    // deuce 規則（當雙方達到最大得分 - 1 時，每人輪流發 1 球）
    if (score_1 >= max_score - 1 && score_2 >= max_score - 1) {
        return totalScore % 2 === 0 ? starting_server : opponent_id
    }

    // 正常發球規則，每人輪發固定次數
    const serveChangeInterval = 2 // 一般情況下每人發 2 球
    const currentRound = Math.floor(totalScore / serveChangeInterval)
    return currentRound % 2 === 0 ? starting_server : opponent_id
}

// 判斷分數是否達到局勝利條件
export const isGameFinish = (score_1, score_2, max_score, deuce = true) => {
    // deuce 情況下則要多贏2分
    if (deuce) {
        // 其中一方得分大於等於max_score分且分數差距大於等於對手2分
        if (
            (score_1 >= max_score && score_1 - score_2 >= 2) ||
            (score_2 >= max_score && score_2 - score_1 >= 2)
        ) {
            return true
        }
    } else {
        // 一般max_score分獲勝
        if (score_1 === max_score || score_2 === max_score) {
            return true
        }
    }

    return false
}

export const isMatchFinish = (score_1, score_2, max_score) => {
    if (score_1 === max_score || score_2 === max_score) {
        return true
    }
    return false
}

/**
 * 防止螢幕熄滅的函數
 */
export const preventScreenSleep = async () => {
    let wakeLock = null

    try {
        // 嘗試獲取螢幕喚醒鎖
        wakeLock = await navigator.wakeLock.request('screen')

        // 處理喚醒鎖意外釋放（例如設備睡眠或切換標籤頁）
        wakeLock.addEventListener('release', () => {
            console.log('螢幕喚醒鎖已釋放')
        })
    } catch (err) {
        console.error('無法啟用螢幕喚醒鎖:', err)
    }

    // 返回喚醒鎖對象，方便日後釋放
    return wakeLock
}

/**
 * 釋放螢幕喚醒鎖的函數
 * @param {WakeLockSentinel} wakeLock - 喚醒鎖對象
 */
export const releaseScreenSleep = wakeLock => {
    if (wakeLock) {
        wakeLock.release().then(() => {
            console.log('螢幕喚醒鎖已手動釋放')
        })
    }
}

/** 計算最大領先優勢
 * @param {team_1} - [1,0,0,1,1...]
 * @param {team_2} - [0,1,1,0,0...]
 */
export const calculateMaxLeadAdvantage = (team_1, team_2) => {
    let lead_1 = 0
    let lead_2 = 0
    let max_lead_team_1 = 0
    let max_lead_team_2 = 0

    for (let i = 0; i < team_1.length; i++) {
        lead_1 += team_1[i]
        lead_2 += team_2[i]

        const lead_difference = lead_1 - lead_2

        if (lead_difference > 0) {
            max_lead_team_1 = Math.max(max_lead_team_1, lead_difference)
        } else if (lead_difference < 0) {
            max_lead_team_2 = Math.max(max_lead_team_2, -lead_difference)
        }
    }

    return {
        team_1: max_lead_team_1,
        team_2: max_lead_team_2
    }
}

/** 計算最大連勝或連敗分
 * @param {team} - [1,0,0,1,1...]
 * @param {target} - 1 or 0 (要計算的目標)
 */
export const calculateMaxStreak = (team, target) => {
    let max_streak = 0
    let current_streak = 0

    for (const point of team) {
        if (point === target) {
            current_streak++
            max_streak = Math.max(max_streak, current_streak)
        } else {
            current_streak = 0
        }
    }

    return max_streak
}

// 尋找陣列中某個屬性的最大值
export const findMaxByKey = (data, key) => {
    return data.reduce((max, current) => Math.max(max, current[key]), -Infinity)
}

// 計算最大落後追回分
export const calculateMaxRecoveredDeficit = (team_1, team_2) => {
    let maxDeficitRecoveredTeam1 = 0 // Team 1 最大落後追回分
    let maxDeficitRecoveredTeam2 = 0 // Team 2 最大落後追回分

    let score1 = 0 // Team 1 當前得分
    let score2 = 0 // Team 2 當前得分
    let deficitRecoveredTeam1 = 0 // Team 1 當前追回的分數
    let deficitRecoveredTeam2 = 0 // Team 2 當前追回的分數

    for (let i = 0; i < team_1.length; i++) {
        score1 += team_1[i]
        score2 += team_2[i]

        const diff = score1 - score2

        // Team 1 落後
        if (diff < 0) {
            deficitRecoveredTeam1 = Math.max(deficitRecoveredTeam1, Math.abs(diff));  // 累計落後分差
        } else {
            maxDeficitRecoveredTeam1 = Math.max(maxDeficitRecoveredTeam1, deficitRecoveredTeam1) // 更新最大落後追回分
            deficitRecoveredTeam1 = 0 // 重置
        }

        // Team 2 落後
        if (diff > 0) {
            deficitRecoveredTeam2 =  Math.max(deficitRecoveredTeam2, diff); // 累計落後分差
        } else {
            maxDeficitRecoveredTeam2 = Math.max(maxDeficitRecoveredTeam2, deficitRecoveredTeam2) // 更新最大落後追回分
            deficitRecoveredTeam2 = 0 // 重置
        }
    }

    // 返回簡化結構
    return {
        team_1: maxDeficitRecoveredTeam1,
        team_2: maxDeficitRecoveredTeam2
    }
}

// 轉換成百分比
// 比率、小數點位數
export const toPercentage = (ratio, decimal = 2) => {
    return (ratio * 100).toFixed(decimal);
}