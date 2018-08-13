export {
    getAction,
    sets,
    currentState,
};
import {
    CardSet,
} from './cards';


var currentState = '';
const setName = ['first', 'second', 'third', 'forth'];
const sets = {};

const Action = {
    treatPassing (msg) {
        const app = document.querySelector('#app');
        for (let i = 0; i < setName.length; i++) {
            sets[setName[i]] = new CardSet(i, msg.cards[setName[i]]);
            const elements = sets[setName[i]].getRenderedElement();
            for (let j = 0; j < elements.length; j++) {
                app.appendChild(elements[j]);
            }
        }
    },
    treatPlaying (msg) {},
    treatScoring (msg) {},
};

const transistion = {
    passing: Action.treatPassing,
    playing: Action.treatPlaying,
    scoring: Action.treatScoring,
};

function getAction (state) {
    currentState = state;
    return transistion[state];
}
