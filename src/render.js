import { getTotalScore } from './service/Scoreboard/helper'
const fakeData = {
    "data": {
        "total_score": {
            "team_1": 11,
                "team_2": 22
        },
        "serve_score": {
            "team_1": 4,
                "team_2": 10
        },
        "receive_score": {
            "team_1": 7,
                "team_2": 12
        },
        "max_lead_score": {
            "team_1": 0,
                "team_2": 7
        },
        "max_winning_streak": {
            "team_1": 3,
                "team_2": 7
        },
        "max_losing_streak": {
            "team_1": 7,
                "team_2": 3
        },
        "max_recovered_deficit": {
            "team_1": 3,
                "team_2": 0
        },
        "scoring_rate": {
            "team_1": null,
                "team_2": null
        },
        "serve_scoring_rate": {
            "team_1": null,
                "team_2": null
        },
        "receive_scoring_rate": {
            "team_1": null,
                "team_2": null
        },
        "post_timeout_scoring_rate": null,
            "average_scoring_time": {
            "team_1": null,
                "team_2": null
        },
        "average_winning_time": {
            "team_1": 635.8214285714286,
                "team_2": 701.6363636363636
        },
        "average_losing_time": {
            "team_1": 701.6363636363636,
                "team_2": 635.8214285714286
        },
        "max_score_time": {
            "team_1": 1538,
                "team_2": 1538
        },
        "min_score_time": {
            "team_1": 390,
                "team_2": 390
        }
    },
    "game_data": {
        "total_score": [
            {
                "game": 1,
                "team_1": 4,
                "team_2": 11
            },
            {
                "game": 2,
                "team_1": 7,
                "team_2": 11
            },
            {
                "game": 3,
                "team_1": 0,
                "team_2": 0
            }
        ],
            "serve_score": [
                {
                    "game": 1,
                    "team_1": 0,
                    "team_2": 3
                },
                {
                    "game": 2,
                    "team_1": 4,
                    "team_2": 7
                },
                {
                    "game": 3,
                    "team_1": 0,
                    "team_2": 0
                }
            ],
                "receive_score": [
                    {
                        "game": 1,
                        "team_1": 4,
                        "team_2": 8
                    },
                    {
                        "game": 2,
                        "team_1": 3,
                        "team_2": 4
                    },
                    {
                        "game": 3,
                        "team_1": 0,
                        "team_2": 0
                    }
                ],
                    "max_lead_score": [
                        {
                            "team_1": 0,
                            "team_2": 7
                        },
                        {
                            "team_1": 0,
                            "team_2": 4
                        }
                    ],
                        "max_winning_streak": [
                            {
                                "team_1": 2,
                                "team_2": 7
                            },
                            {
                                "team_1": 3,
                                "team_2": 4
                            }
                        ],
                            "max_losing_streak": [
                                {
                                    "team_1": 7,
                                    "team_2": 2
                                },
                                {
                                    "team_1": 4,
                                    "team_2": 3
                                }
                            ],
                                "max_recovered_deficit": [
                                    {
                                        "game": 1,
                                        "team_1": 2,
                                        "team_2": 0
                                    },
                                    {
                                        "game": 2,
                                        "team_1": 3,
                                        "team_2": 0
                                    }
                                ],
                                    "scoring_rate": [
                                        {
                                            "game": 1,
                                            "team_1": 26.67,
                                            "team_2": 73.33
                                        },
                                        {
                                            "game": 2,
                                            "team_1": 38.89,
                                            "team_2": 61.11
                                        },
                                        {
                                            "game": 3,
                                            "team_1": null,
                                            "team_2": null
                                        }
                                    ],
                                        "serve_scoring_rate": [
                                            {
                                                "game": 1,
                                                "team_1": 0,
                                                "team_2": 42.86
                                            },
                                            {
                                                "game": 2,
                                                "team_1": 50,
                                                "team_2": 70
                                            },
                                            {
                                                "game": 3,
                                                "team_1": null,
                                                "team_2": null
                                            }
                                        ],
                                            "receive_scoring_rate": [
                                                {
                                                    "game": 1,
                                                    "team_1": 57.14,
                                                    "team_2": 100
                                                },
                                                {
                                                    "game": 2,
                                                    "team_1": 30,
                                                    "team_2": 50
                                                },
                                                {
                                                    "game": 3,
                                                    "team_1": null,
                                                    "team_2": null
                                                }
                                            ],
                                                "post_timeout_scoring_rate": [],
                                                    "game_time": [
                                                        {
                                                            "game": 1,
                                                            "team_1": 9982,
                                                            "team_2": 9982
                                                        },
                                                        {
                                                            "game": 2,
                                                            "team_1": 12341,
                                                            "team_2": 12341
                                                        },
                                                        {
                                                            "game": 3,
                                                            "team_1": 0,
                                                            "team_2": 0
                                                        }
                                                    ],
                                                        "average_scoring_time": [
                                                            {
                                                                "game": 1,
                                                                "team_1": 665.4666666666667,
                                                                "team_2": 665.4666666666667
                                                            },
                                                            {
                                                                "game": 2,
                                                                "team_1": 685.6111111111111,
                                                                "team_2": 685.6111111111111
                                                            },
                                                            {
                                                                "game": 3,
                                                                "team_1": null,
                                                                "team_2": null
                                                            }
                                                        ],
                                                            "average_winning_time": [
                                                                {
                                                                    "game": 1,
                                                                    "team_1": 671.5,
                                                                    "team_2": 663.2727272727273
                                                                },
                                                                {
                                                                    "game": 2,
                                                                    "team_1": 600.1428571428571,
                                                                    "team_2": 740
                                                                }
                                                            ],
                                                                "average_losing_time": [
                                                                    {
                                                                        "game": 1,
                                                                        "team_1": 663.2727272727273,
                                                                        "team_2": 671.5
                                                                    },
                                                                    {
                                                                        "game": 2,
                                                                        "team_1": 740,
                                                                        "team_2": 600.1428571428571
                                                                    }
                                                                ],
                                                                    "max_score_time": [
                                                                        {
                                                                            "team_1": 1098,
                                                                            "team_2": 1098
                                                                        },
                                                                        {
                                                                            "team_1": 1538,
                                                                            "team_2": 1538
                                                                        }
                                                                    ],
                                                                        "min_score_time": [
                                                                            {
                                                                                "team_1": 390,
                                                                                "team_2": 390
                                                                            },
                                                                            {
                                                                                "team_1": 297,
                                                                                "team_2": 297
                                                                            }
                                                                        ]
    }
}

const handlerRender = {
    set(target, property, value) {
        // 渲染計時器
        if (property === 'timer') {
            renderTimer(value)
        }

        // 渲染暫停模式
        if (property === 'is_paused') {
            const is_paused = value && !target.is_game_interval && !target.is_pre_finish
            renderPauseStyle(is_paused)
        }

        // 渲染局間暫停
        if (property === 'is_game_interval') {
            renderGameInterval(value, target.current_game)
        }

        // 渲染結束前畫面
        if (property === 'is_pre_finish') {
            const is_pre_finish = value && target.end_time == null
            renderPreFinish(is_pre_finish)
        }

        // 渲染開始畫面
        if (property === 'start_time') {
            renderStartPage()
            initPage(target)
        }

        // 渲染局數
        if (property === 'current_game') {
            renderGame(value)
        }

        // 渲染發球方
        if (property === 'current_server') {
            renderServer(value)
        }

        // 渲染小分
        if (property === 'game_record') {
            renderScore(value, target.current_game)
        }

        // 渲染大分
        if (property === 'match_record') {
            renderMachScore(value)
        }

        // 比賽結束
        if (property === 'end_time') {
            renderPreFinish(false)
            renderFinishPage(fakeData)
        }

        target[property] = value
        return true
    }
}

// 渲染計時器
const renderTimer = timer => {
    document.querySelector('.js-timer').textContent = timer
}

// 渲染暫停樣式
const renderPauseStyle = is_paused => {
    const screen = document.querySelector('.js-pause-screen')

    if (is_paused) {
        screen.classList.remove('d-none')
    } else {
        screen.classList.add('d-none')
    }
}

// 渲染開始畫面
const renderStartPage = () => {
    const start_screen = document.querySelector('.js-start-screen')
    start_screen.classList.add('d-none')
}

// 渲染小分
const renderScore = (score_record, game) => {
    const team_1_score = document.querySelector('.js-score-1')
    const team_2_score = document.querySelector('.js-score-2')
    const game_score_record = score_record.find(item => item.game === game)
    const team_1_total_score = getTotalScore(game_score_record.team_1)
    const team_2_total_score = getTotalScore(game_score_record.team_2)

    team_1_score.textContent = team_1_total_score
    team_2_score.textContent = team_2_total_score
}

// 渲染大分
const renderMachScore = (match_record) => {
    const team_1_score = document.querySelector('.js-match-score-1')
    const team_2_score = document.querySelector('.js-match-score-2')
    const match_point_1 = document.querySelectorAll('.js-point-1')
    const match_point_2 = document.querySelectorAll('.js-point-2')
    const team_1_total_score = getTotalScore(match_record.team_1)
    const team_2_total_score = getTotalScore(match_record.team_2)

    team_1_score.textContent = team_1_total_score
    team_2_score.textContent = team_2_total_score

    match_point_1.forEach((point, key) => {
        if (key + 1 <= team_1_total_score) {
            point.classList.add('active')
        } else {
            point.classList.remove('active')
        }
    })

    match_point_2.forEach((point, key) => {
        if (key + 1 <= team_2_total_score) {
            point.classList.add('active')
        } else {
            point.classList.remove('active')
        }
    })
}

// 渲染局數
const renderGame = value => {
    const game = document.querySelector('.js-game-text')
    game.textContent = `G${value}`
}

// 渲染發球方
const renderServer = value => {
    const box_1 = document.querySelector('.js-score-box-1')
    const box_2 = document.querySelector('.js-score-box-2')
    const server = value === 1 ? box_1 : box_2
    const receiver = value === 1 ? box_2 : box_1

    server.classList.add('active')
    receiver.classList.remove('active')
}

// 渲染局間暫停
const renderGameInterval = (is_game_interval, game) => {
    const game_screen = document.querySelector('.js-game-interval-screen')
    const game_interval_text = document.querySelector('.js-game-interval-text')

    game_interval_text.textContent = `第${game}局結束`
    if (is_game_interval) {
        game_screen.classList.remove('d-none')
    } else {
        game_screen.classList.add('d-none')
    }
}

// 渲染完成前畫面
const renderPreFinish = is_pre_finish => {
    const finish_screen = document.querySelector('.js-pre-finish-screen')

    if (is_pre_finish) {
        finish_screen.classList.remove('d-none')
    } else {
        finish_screen.classList.add('d-none')
    }
}

// 初始畫畫面
const initPage = value => {
    const team_1_name = document.querySelector('.js-team-1')
    const team_2_name = document.querySelector('.js-team-2')
    const team_1_points = document.querySelectorAll('.js-point-1')
    const team_2_points = document.querySelectorAll('.js-point-2')
    const team_1_timeout_count = document.querySelector('.js-timeout-count-1')
    const team_2_timeout_count = document.querySelector('.js-timeout-count-2')
    const team_1_timeout_btn = document.querySelector('.js-timeout-btn-1')
    const team_2_timeout_btn = document.querySelector('.js-timeout-btn-2')

    // 渲染球員
    team_1_name.textContent = value.teams[0].name
    team_2_name.textContent = value.teams[1].name

    // 渲染暫停
    team_1_timeout_count.textContent = value.config.timeout_count
    team_2_timeout_count.textContent = value.config.timeout_count
    if (value.config.timeout_count === 0) {
        team_1_timeout_btn.classList.add('d-none')
        team_2_timeout_btn.classList.add('d-none')
    }

    // 渲染勝利條件
    team_1_points.forEach((point, key) => {
        if (key + 1 <= value.config.win) {
            point.classList.remove('d-none')
        } else {
            point.classList.add('d-none')
        }
    })
    team_2_points.forEach((point, key) => {
        if (key + 1 <= value.config.win) {
            point.classList.remove('d-none')
        } else {
            point.classList.add('d-none')
        }
    })
}

const renderFinishPage = () => {
    const finish_screen = document.querySelector('.js-finish-screen')
    finish_screen.classList.remove('d-none')
}

export default handlerRender
