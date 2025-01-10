export const ScoreRecord = {
    id: 0, // 索引
    game: 1, // 第幾局
    type: 'common', // 得分方式(正常得分、犯規、暫停) common、foul
    winner: '', // 1 or 2 勝利者
    server: '', // 發球方
    start_time: '', // 開始時間(一般來說是上一分的得分時間，但也有可能會有暫停的情況)
    end_time: '', // 得分時間(翻下計分牌的時間)
    fool_id: '' // 犯規索引 有犯規時才會有值
}
