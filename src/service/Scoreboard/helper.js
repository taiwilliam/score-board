// 參數驗證
export const validateConfig = config => {
    if (!(typeof config === 'object')) {
        throw new Error(
            'config is object ex: {win: 1|2|3|4|5, deuce: boolean, server: 1|2, score: number, timeout_count: number, timeout_time: number, }'
        )
    }
    // 有win 且不是 2、3、4、5
    if ('win' in config && !([1, 2, 3, 4, 5].indexOf(config.win) > 0)) {
        throw new Error('win is 2 to 5')
    }
    // 有score 且不是正整數
    if ('score' in config && !(typeof config.score === 'number' && config.score > 0)) {
        throw new Error('score is a positive integer')
    }
    // 有timeout_count 且不是正整數
    if (
        'timeout_count' in config &&
        !(typeof config.timeout_count === 'number' && config.timeout_count > 0)
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
