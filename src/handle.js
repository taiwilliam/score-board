import Scoreboard from './service/Scoreboard'
import handlerRender from './render'

const startBtnEls = document.querySelectorAll('.js-start-btn')
const pauseBtnEl = document.querySelector('.js-pause-btn')
const stopBtnEl = document.querySelector('.js-stop-btn')
const startForm = document.getElementById('startForm')
const add_1_btn = document.querySelector('.js-add-1-btn')
const add_2_btn = document.querySelector('.js-add-2-btn')

let SBproxy

startBtnEls.forEach(startBtnEl => {
    startBtnEl.addEventListener('click', () => {
        SBproxy.start()
    })
})

pauseBtnEl.addEventListener('click', () => {
    SBproxy.pause()
})

// stopBtnEl.addEventListener('click', () => {
//   proxy.stop();
// })

add_1_btn.addEventListener('click', () => {
    SBproxy.addScore(1)
})

add_2_btn.addEventListener('click', () => {
    SBproxy.addScore(2)
})

startForm.addEventListener('submit', e => {
    e.preventDefault()
    const formData = new FormData(e.target)

    submitStartForm(formData)
})

// 提交開始賽事表單
const submitStartForm = formData => {
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

    console.log('SB', SB)
    SBproxy = new Proxy(SB, handlerRender)
    SBproxy.start()
}
