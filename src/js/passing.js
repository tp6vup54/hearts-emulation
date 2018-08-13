export {
    passingBtnWrapper,
}

const arrowClass = {
    1: 'fas fa-long-arrow-alt-right fa-7x',
    2: 'fas fa-long-arrow-alt-up fa-7x',
    3: 'fas fa-long-arrow-alt-left fa-7x',
};


class PassingButtonWrapper {
    constructor () {
        this.element = document.createElement('i');
        this.setArrowClass();
        this.element.style.display = 'block';
        const app = document.querySelector('#app');
        app.appendChild(this.element);
    }

    setArrowClass () {
        this.element.className = arrowClass[1];
        this.element.className += ' passing animated infinite';
        this.element.classList.add('fadeInLeft');
    }

    enableDisplay (enable) {
        if (enable) {
            this.element.style.display = 'block';
        } else {
            this.element.style.display = 'none';
        }
    }
}

const passingBtnWrapper = new PassingButtonWrapper()
