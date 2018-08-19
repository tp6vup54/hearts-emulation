export {
    refreshAfterPassing,
    animationEnd,
    animationCount,
    acquireAnimationLock,
    completeTransfer,
};
import {
    sets,
} from './machine';
import {
    passingBtnWrapper,
    okBtnWrapper,
} from './wrapper';
import {
    sleep,
} from './util';


var animationEnd = (function(el) {
    var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
    };
  
    for (var t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
})(document.createElement('div'));

var _animationCount = 0;

const animationCount = {
    increment () {
        _animationCount++;
    },

    decrement () {
        _animationCount--;
    },

    lock () {
        return _animationCount == 0;
    },
};

async function acquireAnimationLock () {
    while (!animationCount.lock()) {
        await sleep(100);
    }
}

async function refreshAfterPassing () {
    await sets.first.removeSelectedCards();
    await passingBtnWrapper.enableDisplay(false);
}

async function completeTransfer () {
    sets.first.resetSelected();
    await okBtnWrapper.enableDisplay(false);
}
