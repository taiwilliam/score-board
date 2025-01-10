// 設定
export const Config = {
    // 勝利局數 3 => 5局3勝、2 => 3局2勝
    win: 3,
    // 單局分數 桌球 11分、羽球 21分
    score: 11,
    // 暫停次數 0 則無暫停
    timeout_count: 1,
    // 暫停時間 60秒
    timeout_time: 60, // 暫停時間
    // 是否啟用Deuce
    // true 當對賽雙方打到距離決勝分差1分時仍然平手，領先方必須取得2分差優勢才算獲勝
    // false 得到單局分數者贏得該局
    deuce: true,
    // 發球方
    server: 1
}
