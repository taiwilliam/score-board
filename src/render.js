const handlerRender = {
    set(target, property, value) {
        if(property === 'timer') {
            renderTimer(value);
        }

        if(property === 'is_paused') {
            renderPauseStyle(value);
        }

        if(property === 'start_time') {
            renderStartPage();
            initPage(target);
        }
        
        target[property] = value;
        return true;
    }
};

// 渲染計時器
const renderTimer = (timer) => {
    document.querySelector('.js-timer').textContent = timer;
}

// 渲染暫停樣式
const renderPauseStyle = (is_paused) => {
    const screen = document.querySelector('.js-pause-screen');

    if(is_paused) {
        screen.classList.remove('d-none');
    } else {
        screen.classList.add('d-none');
    }
}

const renderStartPage = () => {
    const start_screen = document.querySelector('.js-start-screen');
    start_screen.classList.add('d-none');
}

const initPage = (value) => {
    const team_1_name = document.querySelector('.js-team-1');
    const team_2_name = document.querySelector('.js-team-2');
    const team_1_points = document.querySelectorAll('.js-point-1');
    const team_2_points = document.querySelectorAll('.js-point-2');
    const team_1_timeout_count = document.querySelector('.js-timeout-count-1');
    const team_2_timeout_count = document.querySelector('.js-timeout-count-2');
    const team_1_timeout_btn = document.querySelector('.js-timeout-btn-1');
    const team_2_timeout_btn = document.querySelector('.js-timeout-btn-2');

    // 渲染球員
    team_1_name.textContent = value.teams[0].name;
    team_2_name.textContent = value.teams[1].name;

    // 渲染暫停
    team_1_timeout_count.textContent = value.config.timeout_count
    team_2_timeout_count.textContent = value.config.timeout_count
    if(value.config.timeout_count === 0) {
        team_1_timeout_btn.classList.add('d-none');
        team_2_timeout_btn.classList.add('d-none');
    }

    // 渲染勝利條件
    team_1_points.forEach((point, key) => {
        if(key + 1 <= value.config.win) {
            point.classList.remove('d-none');
        }else{
            point.classList.add('d-none');
        }
    });
    team_2_points.forEach((point, key) => {
        if(key + 1 <= value.config.win) {
            point.classList.remove('d-none');
        }else{
            point.classList.add('d-none');
        }
    });
}

export default handlerRender;