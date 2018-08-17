export {
    getAction,
    getResponse,
    sets,
    currentState,
};
import {
    CardSet,
} from './cards';
import {
    Sockets,
} from './sockets';

var currentState = '';
const setName = ['first', 'second', 'third', 'forth'];
const sets = {};

const Action = {
    passing (msg) {
        const app = document.querySelector('#app');
        for (let i = 0; i < setName.length; i++) {
            sets[setName[i]] = new CardSet(i, msg.cards[setName[i]]);
            const elements = sets[setName[i]].getRenderedElement();
            for (let j = 0; j < elements.length; j++) {
                app.appendChild(elements[j]);
            }
        }
    },
    playing (msg) {},
    scoring (msg) {},
};

const Response = {
    passing () {
        Sockets.action.send(JSON.stringify({
            state: currentState,
            transfer: sets.first.getSelectedCards(),
        }));
    },
    playing (data) {},
    scoring (data) {},
};

async function getAction (state) {
    currentState = state;
    return Action[state];
}

async function getResponse () {
    return Response[currentState];
}
