import Scoreboard from './service/Scoreboard';
import handler from './render';

// 建立記分板
const SB = new Scoreboard({})
// 設定隊伍
SB.setTeam(1, {
  name: 'william',
  photo: 'https://mighty.tools/mockmind-api/content/human/1.jpg',
})
SB.setTeam(2, {
  name: 'tony',
  photo: 'https://mighty.tools/mockmind-api/content/human/2.jpg',
})

const proxy = new Proxy(SB, handler);


const startBtnEls = document.querySelectorAll('.js-start-btn');
const pauseBtnEl = document.querySelector('.js-pause-btn');
const stopBtnEl = document.querySelector('.js-stop-btn');

startBtnEls.forEach((startBtnEl) => {
  startBtnEl.addEventListener('click', () => {
    proxy.start();
  })
})

pauseBtnEl.addEventListener('click', () => {
  proxy.pause();
})

stopBtnEl.addEventListener('click', () => {
  proxy.stop();
})