export const GameData = {
  // 分數相關
  total_score: [], //各局總分
  serve_score: [], //各局發球得分
  receive_score: [], //各局接發球得分
  max_lead_score: [], //各局最大領先優勢
  max_winning_streak: [], //各局最大連勝分
  max_losing_streak: [], //各局最大連敗分
  max_recovered_deficit: [], //各局最大落後追回分

  // 得分率相關
  scoring_rate: [], //各局得分率
  serve_scoring_rate: [], //各局發球得分率
  receive_scoring_rate: [], //各局接發球得分率
  post_timeout_scoring_rate: [], //各局暫停後得分率（單局）

  // 時間相關
  game_time: [], // 每局時間
  average_scoring_time: [], //各局每分平均時間
  average_winning_time: [], //各局得分平均時間
  average_losing_time: [], //各局失分平均時間
  max_score_time: [], //各局最大分時間
  min_score_time: [], //各局最小分時間
}