import { getTotalScore, formatTime, formatMilliseconds } from './service/Scoreboard/helper'
import { DATA_NAME_MAPPING, GAME_DATA_NAME_MAPPING } from './service/Scoreboard/constants'
import { score_data } from './fakedata'

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
        if (property === 'is_finish') {
            renderPreFinish(false)
            renderFinishPage(target)
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
const renderMachScore = match_record => {
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
    const team_1_points = document.querySelectorAll('.js-point-1')
    const team_2_points = document.querySelectorAll('.js-point-2')
    const team_1_timeout_count = document.querySelector('.js-timeout-count-1')
    const team_2_timeout_count = document.querySelector('.js-timeout-count-2')
    const team_1_timeout_btn = document.querySelector('.js-timeout-btn-1')
    const team_2_timeout_btn = document.querySelector('.js-timeout-btn-2')

    // 渲染隊伍
    renderTeam(value.teams[0], value.teams[1])

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

// 渲染隊伍
const renderTeam = (team_1, team_2) => {
    const team_1_name_els = document.querySelectorAll('.js-team-1')
    const team_2_name_els = document.querySelectorAll('.js-team-2')

    // 渲染球員
    team_1_name_els.forEach(team_1_name => {
        team_1_name.textContent = team_1.name
    })
    team_2_name_els.forEach(team_2_name => {
        team_2_name.textContent = team_2.name
    })
}

// 渲染完成畫面
const renderFinishPage = score_data => {
    const result = score_data.result
    // 開啟完成畫面
    openFinishPage()
    // 渲染隊伍
    renderTeam(score_data.teams[0], score_data.teams[1])
    // 渲染大分
    renderFinishTopScore(result.data.match_score.team_1, result.data.match_score.team_2)
    // 渲染賽事時間
    renderMatchTime(score_data.start_time, score_data.end_time)
    // 渲染Match Score
    renderMatchScore(result.data.match_score, result.game_data.total_score)
    // 渲染Match Stats
    renderMatchStats(score_data.match_record, result.data, result.game_data)
}

// 渲染Match Stats
const renderMatchStats = (match_record, match_data, game_data) => {
    // 渲染Match Stats Tab
    renderMatchStatsTab(match_record)

    // 渲染Match Stats Content
    renderMatchStatsContent(match_data, game_data)
}

// 渲染Match Stats Content
const renderMatchStatsContent = (match_data, game_data) => {
    const DATA_HIDE_KEY = ['match_score']
    const GAME_DATA_HIDE_KEY = []

    const new_game_data = formatGameData(game_data)

    new_game_data.forEach((game_data, index) => {
        renderMatchStatsTr(game_data, GAME_DATA_HIDE_KEY, index + 1, false)
    })

    // 渲染Match Stats Match Content
    renderMatchStatsTr(match_data, DATA_HIDE_KEY, 0, true)
}

const formatGameData = game_data => {
    const game_count = game_data.total_score.length
    const new_game_data = [{}, {}, {}]
    for (let i = 0; i < game_count; i++) {
        for (const key in game_data) {
            new_game_data[i][key] = game_data[key][i]
        }
    }
    return new_game_data.reverse()
}

// 渲染Match Stats Tr
const renderMatchStatsTr = (match_data, hide_key_arr, nav_key, isMatch = true) => {
    const match_stats_tab = document.querySelector('.js-match-stats-tab')

    let html = ''
    for (const key in match_data) {
        if (match_data[key]) {
            // 排除不顯是的資料
            if (hide_key_arr.includes(key)) continue

            const name = isMatch ? DATA_NAME_MAPPING[key] : GAME_DATA_NAME_MAPPING[key]
            const { team_1, team_2 } = match_data[key]
            let team_1_string =
                !Number.isInteger(team_1) && typeof team_1 === 'number' ? team_1.toFixed(2) : team_1
            let team_2_string =
                !Number.isInteger(team_2) && typeof team_2 === 'number' ? team_2.toFixed(2) : team_2

            // 時間格式化
            if (key.includes('_time')) {
                team_1_string = formatMilliseconds(team_1_string)
                team_2_string = formatMilliseconds(team_2_string)
            }

            // 比率格式化
            if (key.includes('_rate')) {
                team_1_string = `${team_1_string}%`
                team_2_string = `${team_2_string}%`
            }

            html += `
                <tr class="x-table-tr js-stats-tr${ isMatch ? '' : ' d-none' }" data-id="${nav_key}">
                    <td data="${team_1}">${team_1_string}</td>
                    <td class="x-table-header">${name}</td>
                    <td data="${team_2}">${team_2_string}</td>
                </tr>
            `
        }
    }

    match_stats_tab.insertAdjacentHTML('afterend', html)
}

// 渲染Match Stats Tab
const renderMatchStatsTab = match_record => {
    const match_tab = document.querySelector('.js-table-tab')
    let html = ''
    for (let i = 0; i <= match_record.team_1.length; i++) {
        const name = i === 0 ? 'Match' : `G${i}`
        const active = i === 0 ? ' active' : ''
        html += `<li class="nav-item">
            <a class="nav-link js-nav-btn${active}" href="#" data-id="${i}">${name}</a>
        </li>`
    }
    match_tab.innerHTML = html
}

// 渲染Match Score
const renderMatchScore = (match_data, game_data) => {
    const match_score_title = document.querySelector('.js-match-score-title')
    const match_score_1_tr = document.querySelector('.js-match-score-tr-1')
    const match_score_2_tr = document.querySelector('.js-match-score-tr-2')
    const match_score_1_td = match_score_1_tr.querySelectorAll('td')
    const match_score_2_td = match_score_2_tr.querySelectorAll('td')
    const { team_1: team_1_match_score, team_2: team_2_match_score } = match_data

    // 清除td
    clearMatchScoreTd(match_score_1_td, match_score_2_td)

    // 渲染小分 td
    renderMatchScoreSmallTd(
        game_data,
        match_score_1_tr,
        match_score_2_tr
    )

    // 渲染大分 td
    renderMatchScoreBigTd(
        team_1_match_score,
        team_2_match_score,
        match_score_1_tr,
        match_score_2_tr
    )

    match_score_title.setAttribute('colspan', game_data.length + 1 + 1)
}

// 清除score match td
const clearMatchScoreTd = (match_score_1_td, match_score_2_td) => {
    match_score_1_td.forEach(td => td.remove())
    match_score_2_td.forEach(td => td.remove())
}

// 渲染大分 td
const renderMatchScoreBigTd = (
    team_1_match_score,
    team_2_match_score,
    match_score_1_tr,
    match_score_2_tr
) => {
    const match_score_1_th = match_score_1_tr.querySelector('th')
    const match_score_2_th = match_score_2_tr.querySelector('th')
    const td_header_1 = document.createElement('td')
    const td_header_2 = document.createElement('td')
    td_header_1.classList.add('x-table-header')
    td_header_2.classList.add('x-table-header')
    td_header_1.textContent = team_1_match_score
    td_header_2.textContent = team_2_match_score
    team_1_match_score > team_2_match_score
        ? td_header_1.classList.add('active')
        : td_header_2.classList.add('active')
    match_score_1_tr.insertBefore(td_header_1, match_score_1_th.nextSibling)
    match_score_2_tr.insertBefore(td_header_2, match_score_2_th.nextSibling)
}

// 渲染小分 td
const renderMatchScoreSmallTd = (
    game_score,
    match_score_1_tr,
    match_score_2_tr
) => {
    const reverse_game_score = game_score.reverse()
    const match_score_1_th = match_score_1_tr.querySelector('th')
    const match_score_2_th = match_score_2_tr.querySelector('th')

    reverse_game_score.forEach((score, index) => {
        const td_1_el = document.createElement('td')
        const td_2_el = document.createElement('td')
        const score_1 = score.team_1
        const score_2 = score.team_2
        td_1_el.textContent = score_1
        td_2_el.textContent = score_2
        score_1 > score_2 ? td_1_el.classList.add('active') : td_2_el.classList.add('active')

        match_score_1_tr.insertBefore(td_1_el, match_score_1_th.nextSibling)
        match_score_2_tr.insertBefore(td_2_el, match_score_2_th.nextSibling)
    })
}

// 開啟完成畫面
const openFinishPage = () => {
    const finish_screen = document.querySelector('.js-finish-screen')
    finish_screen.classList.remove('d-none')
}

// 渲染完成畫面Top
const renderFinishTopScore = (score_1, score_2) => {
    const match_score_1 = document.querySelector('.js-top-match-score-1')
    const match_score_2 = document.querySelector('.js-top-match-score-2')

    match_score_1.textContent = score_1
    match_score_2.textContent = score_2
    if (score_1 > score_2) {
        match_score_1.classList.add('text-primary')
    } else {
        match_score_2.classList.add('text-primary')
    }
}
// 渲染賽事時間
const renderMatchTime = (start_time, end_time) => {
    const match_time_el = document.querySelector('.js-match-time')
    const start = new Date(start_time).getTime()
    const end = new Date(end_time).getTime()
    const match_time = formatTime(end - start)

    match_time_el.textContent = match_time
}

export default handlerRender
