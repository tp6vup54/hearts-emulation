export {
    Card,
    CardSet,
    createNewCardSet,
    OfferedCards,
};
import {
    currentState,
    sets,
} from './machine';
import {
    animationEnd,
    animationCount,
    acquireAnimationLock,
} from './invalidate';
import {
    passingBtnWrapper,
    okBtnWrapper,
} from './wrapper';


const chars = {
    'J': 'jack',
    'Q': 'queen',
    'K': 'king',
    'A': 'ace',
    'T': '10',
};

const suits = {
    's': 'spades',
    'h': 'hearts',
    'd': 'diamonds',
    'c': 'clubs',
};

const cardPostitionSetting = {
    cardSpacing: 25,
    edgeSpacing: 20,
    cardRatio: 1.455,
    cardSelected: 30,
};

const selectedUpperBound = {
    passing: 3,
    playing: 1,
};

const PositionSetter = {
    first (cards) {
        const y = window.innerHeight - cardPostitionSetting.edgeSpacing - cards[0].height;
        const firstX = window.innerWidth / 2 - cards[0].width / 2 - 5 * cardPostitionSetting.cardSpacing;
        for (let i = 0; i < cards.length; i++) {
            cards[i].playerId = 0;
            cards[i].element.classList.add('first');
            cards[i].element.style.left = firstX + i * cardPostitionSetting.cardSpacing + 'px';
            cards[i].element.style.top = y + 'px';
        }
    },
    second (cards) {
        const x = cardPostitionSetting.edgeSpacing;
        const firstY = window.innerHeight / 2 - cards[0].height / 2 - 5 * cardPostitionSetting.cardSpacing;
        for (let i = 0; i < cards.length; i++) {
            cards[i].playerId = 1;
            cards[i].element.classList.add('second');
            cards[i].element.style.left = x + 'px';
            cards[i].element.style.top = firstY + i * cardPostitionSetting.cardSpacing + 'px';
        }
    },
    third (cards) {
        const y = cardPostitionSetting.edgeSpacing
        const firstX = window.innerWidth / 2 - cards[0].width / 2 + 5 * cardPostitionSetting.cardSpacing;
        for (let i = 0; i < cards.length; i++) {
            cards[i].playerId = 2;
            cards[i].element.classList.add('third');
            cards[i].element.style.left = firstX - i * cardPostitionSetting.cardSpacing + 'px';
            cards[i].element.style.top = y + 'px';
        }
    },
    forth (cards) {
        const x = window.innerWidth - cardPostitionSetting.edgeSpacing - cards[0].height;
        const firstY = window.innerHeight / 2 - cards[0].height / 2 + 5 * cardPostitionSetting.cardSpacing;
        for (let i = 0; i < cards.length; i++) {
            cards[i].playerId = 3;
            cards[i].element.classList.add('forth');
            cards[i].element.style.left = x + 'px';
            cards[i].element.style.top = firstY - i * cardPostitionSetting.cardSpacing + 'px';
        }
    },
};

const TablePosition = {
    first (card) {
        const x = window.innerWidth / 2 - card.clientWidth / 2;
        const y = window.innerHeight / 2 + ((parseInt(card.style.top) - window.innerHeight / 2) / 2) - card.clientHeight / 4;
        card.style.left = x + 'px';
        card.style.top = y + 'px';
    },
    second (card) {
        const x = window.innerWidth / 2 - ((window.innerWidth / 2 - parseInt(card.style.left)) / 2) - card.clientWidth / 2;
        const y = window.innerHeight / 2 - card.clientHeight / 2;
        card.style.left = x + 'px';
        card.style.top = y + 'px';
    },
    third (card) {
        const x = window.innerWidth / 2 - card.clientWidth / 2;
        const y = window.innerHeight / 2 - ((window.innerHeight / 2 - (parseInt(card.style.top))) / 2) - card.clientHeight / 4;
        card.style.left = x + 'px';
        card.style.top = y + 'px';
    },
    forth (card) {
        const x = window.innerWidth / 2 + ((parseInt(card.style.left) - window.innerWidth / 2) / 2) + card.clientWidth / 2;
        const y = window.innerHeight / 2 - card.clientHeight / 2;
        card.style.left = x + 'px';
        card.style.top = y + 'px';
    },
};

const posSetter = {
    0: PositionSetter.first,
    1: PositionSetter.second,
    2: PositionSetter.third,
    3: PositionSetter.forth,
};

const tableSetter = {
    0: TablePosition.first,
    1: TablePosition.second,
    2: TablePosition.third,
    3: TablePosition.forth,
}

class Card {
    constructor (cardName, playerId) {
        this.cardName = cardName;
        this.width = 100;
        this.playerId = playerId;
        this.height = this.width * cardPostitionSetting.cardRatio;
        this.element = this.getRenderedElement();
    }

    getCardImgName () {
        var name = '/img/';
        if (this.cardName) {
            if (this.cardName[0] in chars) {
                name += chars[this.cardName[0]];
            } else {
                name += this.cardName[0];
            }
            name += '_of_' + suits[this.cardName[1]] + '.png';
            return name
        } else {
            return name + 'back.png'
        }
    }

    getRenderedElement () {
        const div = document.createElement('div');
        div.setAttribute('class', 'card');
        const img = document.createElement('img');
        img.setAttribute('src', this.getCardImgName());
        div.appendChild(img);
        div.setAttribute('playerId', this.playerId);
        div.addEventListener('click', selectCard);
        return div;
    }

    changeCardName (newCardName) {
        this.cardName = newCardName;
        this.element.querySelector('img').setAttribute('src', this.getCardImgName());
        this.cardName = newCardName;
    }
}


class CardSet {
    constructor (playerId, cards) {
        this.cards = [];
        this.playerId = playerId;
        this.addCards(cards);
    }

    getRenderedElement () {
        const cardElements = [];
        for (let i = 0; i < this.cards.length; i++) {
            cardElements.push(this.cards[i].element);
        }
        return cardElements;
    }

    resetPos () {
        posSetter[this.playerId](this.cards);
    }

    addCards (cards) {
        if (cards) {
            for (let i = 0; i < cards.length; i++) {
                this.cards.push(new Card(cards[i], this.playerId));
            }
        } else {
            for (let i = 0; i < 13; i++) {
                this.cards.push(new Card(null, this.playerId));
            }
        }
        posSetter[this.playerId](this.cards);
    }

    moveCardToTable (target) {
        tableSetter[this.playerId](target);
    }
}

class EnemyCardSet extends CardSet {
    constructor (playerId, cards) {
        super(playerId, cards);
    }

    offerCard (cardName) {
        const c = this.cards.pop();
        c.changeCardName(cardName);
        this.moveCardToTable(c.element);
        return c;
    }
}

class MyCardSet extends CardSet {
    constructor (playerId, cards) {
        super(playerId, cards);
    }

    getSelectedCount () {
        var count = 0;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].element.classList.contains('selected')) {
                count++;
            }
        }
        return count;
    }

    getSelectedCards () {
        const ret = [];
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].element.classList.contains('selected')) {
                ret.push(this.cards[i]);
            }
        }
        return ret;
    }

    getSelectedCardNames () {
        const l = this.getSelectedCards();
        const ret = [];
        for (let i = 0; i < l.length; i++) {
            ret.push(l[i].cardName);
        }
        return ret;
    }

    async removeSelectedCards () {
        const removeElement = [];
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].element.classList.contains('selected')) {
                removeElement.push(this.cards[i]);
            }
        }
        for (let i = 0; i < removeElement.length; i++) {
            this.cards.splice(this.cards.indexOf(removeElement[i]), 1);
            animationCount.increment();
            removeElement[i].element.classList.add('animated');
            removeElement[i].element.classList.add('fadeOutUp');
            removeElement[i].element.classList.add('removed');
            removeElement[i].element.addEventListener(animationEnd, (e) => {
                animationCount.decrement();
                e.currentTarget.parentNode.removeChild(e.currentTarget);
            });
        }
    }

    removeAllCards () {
        for (let i = 0; i < this.cards.length; i++) {
            animationCount.increment();
            this.cards[i].element.classList.add('animated');
            this.cards[i].element.classList.add('fadeOutRight');
            this.cards[i].element.classList.add('removed');
            this.cards[i].element.addEventListener(animationEnd, (e) => {
                animationCount.decrement();
                e.currentTarget.parentNode.removeChild(e.currentTarget);
            });
        }
        this.cards = [];
    }

    behaveFadeIn () {
        const app = document.querySelector('#app');
        for (let i = 0; i < this.cards.length; i++) {
            app.appendChild(this.cards[i].element);
            animationCount.increment();
            this.cards[i].element.classList.add('animated');
            this.cards[i].element.classList.add('fadeInLeft');
            this.cards[i].element.addEventListener(animationEnd, (e) => {
                animationCount.decrement();
                e.currentTarget.classList.remove('animated');
                e.currentTarget.classList.remove('fadeInLeft');
            });
        }
    }

    behaveReceived (receivedCards) {
        for (let i = 0; i < receivedCards.length; i++) {
            for (let j = 0; j < this.cards.length; j++) {
                if (this.cards[j].cardName == receivedCards[i]) {
                    animateSelectCard(this.cards[j].element, true);
                    break;
                }
            }
        }
    }

    resetSelected () {
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].element.classList.contains('selected')) {
                animateSelectCard(this.cards[i].element, false);
            }
        }
    }

    async refreshCards (receivedCards, newCards) {
        await acquireAnimationLock();
        this.removeAllCards();
        await acquireAnimationLock();
        this.addCards(newCards);
        this.behaveFadeIn();
        await acquireAnimationLock();
        this.behaveReceived(receivedCards);
        okBtnWrapper.enableDisplay(true);
    }

    constrainOffer (required) {
        if (required.type == 'card') {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].cardName == required.value) {
                    this.cards[i].element.classList.add('movable');
                    break;
                }
            }
        } else {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].cardName[1] == required.value) {
                    this.cards[i].element.classList.add('movable');
                }
            }
        }
    }

    offerSelectedCard () {
        const c = this.getSelectedCards()[0];
        this.cards.splice(this.cards.indexOf(c), 1);
        this.moveCardToTable(c.element);
        return c;
    }
}

class OfferedCards {
    constructor () {
        this.cards = [];
    }

    push (card) {
        this.cards.push(card);
    }

    toPlayer (playerId) {
        this.cards = [];
    }
}

function createNewCardSet (playerId, cards) {
    if (playerId == 0) {
        return new MyCardSet(playerId, cards);
    } else {
        return new EnemyCardSet(playerId, cards);
    }
}

async function selectCard (e) {
    if (e.currentTarget.getAttribute('playerId') != 0) {
        return;
    }
    if (!(currentState.name in selectedUpperBound)) {
        return;
    }
    if (currentState.name == 'passing') {
        await selectCardUnderPassing(e);
    } else if (currentState.name == 'playing') {
        await selectCardUnderPlaying(e);
    }
}

async function selectCardUnderPassing (e) {
    const upper = selectedUpperBound[currentState.name];
    if (e.currentTarget.classList.contains('selected')) {
        animateSelectCard(e.currentTarget, false);
    } else {
        if (sets.first.getSelectedCount() < upper) {
            animateSelectCard(e.currentTarget, true);
        }
    }
    if (sets.first.getSelectedCount() == upper) {
        await passingBtnWrapper.enableDisplay(true);
    } else {
        await passingBtnWrapper.enableDisplay(false);
    }
}

async function selectCardUnderPlaying (e) {
    const upper = selectedUpperBound[currentState.name];
    if (!e.currentTarget.classList.contains('movable')) {
        return;
    }
    if (e.currentTarget.classList.contains('selected')) {
        animateSelectCard(e.currentTarget, false);
    } else {
        if (sets.first.getSelectedCount() < upper) {
            animateSelectCard(e.currentTarget, true);
        }
    }
    if (sets.first.getSelectedCount() == upper) {
        await okBtnWrapper.enableDisplay(true);
    } else {
        await okBtnWrapper.enableDisplay(false);
    }
}

function animateSelectCard (target, enable) {
    if (enable) {
        target.classList.add('selected');
        target.style.top = parseInt(target.style.top, 10) - cardPostitionSetting.cardSelected + 'px';
    } else {
        target.classList.remove('selected');
        parseInt(target.style.top, 10)
        target.style.top = parseInt(target.style.top, 10) + cardPostitionSetting.cardSelected + 'px';
    }
}
