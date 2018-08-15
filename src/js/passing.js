export {
    passingBtnWrapper,
};
import {
    getResponse,
} from './machine';
import {
    refreshAfterPassing,
} from './invalidate';

const arrowClass = {
    1: 'fas fa-long-arrow-alt-right fa-7x',
    2: 'fas fa-long-arrow-alt-up fa-7x',
    3: 'fas fa-long-arrow-alt-left fa-7x',
};


class PassingButtonWrapper {
    constructor () {
        this.element = document.createElement('i');
        this.setArrowClass();
        this.element.style.display = 'none';
        this.element.addEventListener('click', this.onClick);
        const app = document.querySelector('#app');
        app.appendChild(this.element);
    }

    setArrowClass () {
        this.element.className = arrowClass[1];
        this.element.className += ' passing animated infinite';
        this.element.classList.add('fadeInLeft');
    }

    async enableDisplay (enable) {
        if (enable) {
            this.element.style.display = 'block';
        } else {
            this.element.style.display = 'none';
        }
    }

    async onClick () {
        const func = await getResponse()
        await func();
        await refreshAfterPassing();
    }
}

const passingBtnWrapper = new PassingButtonWrapper()
