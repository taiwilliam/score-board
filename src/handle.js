import Scoreboard from './service/Scoreboard'
import handlerRender from './render'
import { preventScreenSleep, preventZoom  } from './service/Scoreboard/helper'

const resumeBtnEl = document.querySelector('.js-resume-btn')
const pauseBtnEl = document.querySelector('.js-pause-btn')
const resetBtnEl = document.querySelector('.js-reset-btn')
const nextGameBtnEl = document.querySelector('.js-next-game-btn')
const prevBtnEls = document.querySelectorAll('.js-prev-btn')
const swapBtnEl = document.querySelector('.js-swap-btn')
const startForm = document.getElementById('startForm')
const finishBtn = document.querySelector('.js-finish-btn')
const add_1_btn = document.querySelector('.js-add-1-btn')
const add_2_btn = document.querySelector('.js-add-2-btn')

let SBproxy
let wakeLock

// DOM 加載完成後啟用防止縮放功能
document.addEventListener('DOMContentLoaded', function () {
    preventZoom();
});

// 繼續按紐
resumeBtnEl.addEventListener('click', () => {
    SBproxy.resume()
})

// 暫停按紐
pauseBtnEl.addEventListener('click', () => {
    SBproxy.pause()
})

// 重置按紐
resetBtnEl.addEventListener('click', () => {
    //   proxy.stop();
})

// 開始下一局按紐
nextGameBtnEl.addEventListener('click', () => {
    SBproxy.startNextGame()
})

// 上一步按紐
prevBtnEls.forEach(prevBtnEl => {
    prevBtnEl.addEventListener('click', () => {
        SBproxy.prev()
    })
})

// 交換按紐
swapBtnEl.addEventListener('click', () => {
    const content = document.querySelector('.js-content')
    content.classList.toggle('x-swap')
})

// 加分按紐 團隊一
add_1_btn.addEventListener('click', () => {
    SBproxy.addScore(1)
})

// 加分按紐 團隊二
add_2_btn.addEventListener('click', () => {
    SBproxy.addScore(2)
})

// 完成按紐
finishBtn.addEventListener('click', () => {
    SBproxy.finish()
    wakeLock.release()
})

// 開始賽事表單
startForm.addEventListener('submit', e => {
    e.preventDefault()
    const formData = new FormData(e.target)

    submitStartForm(formData)
})

// 提交開始賽事表單
const submitStartForm = async formData => {
    const formObject = Object.fromEntries(formData.entries())
    // 建立記分板
    const SB = new Scoreboard({
        win: parseInt(formObject.win),
        score: parseInt(formObject.score),
        timeout_count: parseInt(formObject.timeout_count),
        timeout_time: parseInt(formObject.timeout_time),
        deuce: formObject.deuce === 'true',
        server: parseInt(formObject.server)
    })

    // 設定隊伍
    SB.setTeam(1, {
        name: String(formObject.team_1),
        photo: 'https://mighty.tools/mockmind-api/content/human/1.jpg'
    })
    SB.setTeam(2, {
        name: String(formObject.team_2),
        photo: 'https://mighty.tools/mockmind-api/content/human/2.jpg'
    })

    // 代理記分板 用於監聽畫面渲染
    SBproxy = new Proxy(SB, handlerRender)
    SBproxy.start()
    // 防止螢幕休眠
    wakeLock = await preventScreenSleep()
}
