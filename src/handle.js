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

// 導航按紐
document.addEventListener('click', (event) => {
    // 確保點擊的目標是帶有 js-nav-btn 類的元素或其子元素
    const navItem = event.target.closest('.js-nav-btn');

    if (navItem) {
        handleClickNavBtn(navItem)
    }
});

// 點擊導航按鈕
const handleClickNavBtn = (navItem) => {
    // 獲取 data-id 值
    const nav_Id = navItem.dataset.id;
    const tr_els = document.querySelectorAll('.js-stats-tr');
    const show_tr_els = document.querySelectorAll(`.js-stats-tr[data-id="${nav_Id}"]`);
    const btn_els = document.querySelectorAll('.js-nav-btn');
    const show_btn_el = document.querySelectorAll(`.js-nav-btn[data-id="${nav_Id}"]`);

    // 隱藏全部並顯示指定btn
    btn_els.forEach(btn_el => btn_el.classList.remove('active'));
    show_btn_el.forEach(show_btn_el => show_btn_el.classList.add('active'));

    // 隱藏全部並顯示指定content
    tr_els.forEach(tr_el => tr_el.classList.add('d-none'));
    show_tr_els.forEach(show_el => show_el.classList.remove('d-none'));
}

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
