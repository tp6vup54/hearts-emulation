export {
    passingBtnWrapper,
    okBtnWrapper,
};
import {
    getResponse,
    currentState,
    sets,
} from './machine';
import {
    refreshAfterPassing,
    completeTransfer,
} from './invalidate';

const arrowClass = {
    1: 'fas fa-long-arrow-alt-right fa-7x',
    2: 'fas fa-long-arrow-alt-up fa-7x',
    3: 'fas fa-long-arrow-alt-left fa-7x',
};

class Wrapper {
    constructor () {
        this.element = null;
    }

    async enableDisplay (enable) {
        if (enable) {
            this.element.style.display = 'block';
        } else {
            this.element.style.display = 'none';
        }
    }
}


class PassingButtonWrapper extends Wrapper{
    constructor () {
        super();
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

    async onClick () {
        const func = await getResponse()
        await func();
        await refreshAfterPassing();
    }
}

class OkButtonWrapper extends Wrapper{
    constructor () {
        super();
        this.element = document.createElement('div');
        this.element.innerHTML = 'OK';
        this.element.className = 'button-ok';
        this.element.style.display = 'none';
        this.element.addEventListener('click', this.onClick);
        const app = document.querySelector('#app');
        app.appendChild(this.element);
    }

    async onClick () {
        if (currentState.name == 'transfer') {
            await completeTransfer();
        } else if (currentState.name == 'playing') {
            let c = sets.first.offerSelectedCard();
            currentState.updateMyOffered(c);
        }
        await currentState.response();
    }
}

const passingBtnWrapper = new PassingButtonWrapper();
const okBtnWrapper = new OkButtonWrapper();
