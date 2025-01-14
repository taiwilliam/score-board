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
    const result = { ...container } // 複製容器對象
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
    const totalScore = score_1 + score_2;
    const opponent_id = starting_server === 1 ? 2 : 1;

    // deuce 規則（當雙方達到最大得分 - 1 時，每人輪流發 1 球）
    if (score_1 >= max_score - 1 && score_2 >= max_score - 1) {
        return totalScore % 2 === 0 ? starting_server : opponent_id;
    }

    // 正常發球規則，每人輪發固定次數
    const serveChangeInterval = 2; // 一般情況下每人發 2 球
    const currentRound = Math.floor(totalScore / serveChangeInterval);
    return currentRound % 2 === 0 ? starting_server : opponent_id;
}

// 判斷分數是否達到局勝利條件
export const isGameFinish = (score_1, score_2, max_score, deuce = true) => {
    // deuce 情況下則要多贏2分
    if(deuce) {
        // 其中一方得分大於等於max_score分且分數差距大於等於對手2分
        if(
            (score_1 >= max_score && score_1 - score_2 >= 2) || 
            (score_2 >= max_score && score_2 - score_1 >= 2)
        ) {
            return true
        }
    }else{
        // 一般max_score分獲勝
        if(score_1 === max_score || score_2 === max_score) {
            return true
        }
    }

    return false
}