import { getTotalScore } from './service/Scoreboard/helper'

const handlerRender = {
    set(target, property, value) {
        // 渲染計時器
        if (property === 'timer') {
            renderTimer(value)
        }

        // 渲染暫停模式
        if (property === 'is_paused') {
            renderPauseStyle(value)
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

        // 渲染局間暫停
        if (property === 'is_game_interval') {
            renderGameInterval(value)
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
const renderGameInterval = value => {
    const game_content = document.querySelector('.js-game-interval-content')
    const pause_content = document.querySelector('.js-pause-content')

    if (value) {
        game_content.classList.remove('d-none')
        pause_content.classList.add('d-none')
    } else {
        game_content.classList.add('d-none')
        pause_content.classList.remove('d-none')
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

export default handlerRender
