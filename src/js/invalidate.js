export {
    refreshAfterPassing,
    animationEnd,
    animationCount,
};
import {
    sets,
} from './machine';
import {
    passingBtnWrapper,
} from './passing';

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
};

async function refreshAfterPassing () {
    await sets.first.removeSelectedCards();
    await passingBtnWrapper.enableDisplay(false);
}


