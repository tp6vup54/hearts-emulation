export {
    getState,
    getResponse,
    sets,
    currentState,
};
import {
    createNewCardSet,
    OfferedCards,
} from './cards';
import {
    Sockets,
} from './sockets';

var currentState = '';
const setName = ['first', 'second', 'third', 'forth'];
const sets = {};

class State {
    action (msg) {}
    response () {}
}

class PassingState extends State {
    constructor () {
        super();
        this.name = 'passing';
    }
    async action (msg) {
        const app = document.querySelector('#app');
        for (let i = 0; i < setName.length; i++) {
            sets[setName[i]] = createNewCardSet(i, msg.cards[setName[i]]);
            const elements = sets[setName[i]].getRenderedElement();
            for (let j = 0; j < elements.length; j++) {
                app.appendChild(elements[j]);
            }
        }
    }
    response () {
        Sockets.action.send(JSON.stringify({
            state: currentState.name,
            transfer: sets.first.getSelectedCardNames(),
        }));
    }
}

class TransferState extends State {
    constructor () {
        super();
        this.name = 'transfer';
    }
    async action (msg) {
        sets.first.refreshCards(msg.received, msg.cards);
    }
    response () {
        Sockets.action.send(JSON.stringify({
            state: currentState.name,
            text: 'ok',
        }));
    }
}

class PlayingState extends State {
    constructor () {
        super();
        this.name = 'playing';
        this.offered = new OfferedCards();
    }
    async action (msg) {
        const actions = msg.actions;
        for (let i = 0; i < actions.length; i++) {
            this.offered.push(sets[actions[i].name].offerCard(actions[i].card));
        }
        sets.first.constrainOffer(msg.required);
    }
    updateMyOffered (card) {
        this.offered.push(card);
    }
    response () {
        Sockets.action.send(JSON.stringify({
            state: currentState.name,
            card: this.offered.cards[this.offered.cards.length - 1].cardName,
        }));
    }
}

function generateStateInstance (state) {
    const states = {
        'passing': () => {
            return new PassingState();
        },
        'transfer': () => {
            return new TransferState();
        },
        'playing': () => {
            return new PlayingState();
        }
    }
    return states[state];
}

async function getState (state) {
    currentState = generateStateInstance(state)();
    return currentState;
}

async function getResponse () {
    return currentState.response;
}
