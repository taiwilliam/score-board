const handler = {
    set(target, property, value) {
        if(property === 'timer') {
            renderTimer(value);
        }

        if(property === 'is_paused') {
            renderPauseStyle(value);
        }
        
        target[property] = value;
        return true;
    }
};

const renderTimer = (timer) => {
    document.querySelector('.js-timer').textContent = timer;
}

const renderPauseStyle = (is_paused) => {
    const screen = document.querySelector('.js-pause-screen');

    if(is_paused) {
        screen.classList.remove('d-none');
    } else {
        screen.classList.add('d-none');
    }
}

export default handler;