import Scoreboard from './service/Scoreboard';
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




const startBtnEl = document.querySelector('.js-start-btn');
const pauseBtnEl = document.querySelector('.js-pause-btn');
const stopBtnEl = document.querySelector('.js-stop-btn');

startBtnEl.addEventListener('click', () => {
  SB.start();
})

pauseBtnEl.addEventListener('click', () => {
  SB.pause();
})

stopBtnEl.addEventListener('click', () => {
  SB.stop();
})