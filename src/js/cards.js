export {
    Card,
    CardSet,
};
import {
    currentState,
    sets,
} from './machine';
import {
    passingBtnWrapper,
} from './passing';


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

const posSetter = {
    0: PositionSetter.first,
    1: PositionSetter.second,
    2: PositionSetter.third,
    3: PositionSetter.forth,
};

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
        if (this.playerId == 0) {
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
}


class CardSet {
    constructor (playerId, cards) {
        this.cards = [];
        if (cards) {
            for (let i = 0; i < cards.length; i++) {
                this.cards.push(new Card(cards[i], playerId));
            }
        } else {
            for (let i = 0; i < 13; i++) {
                this.cards.push(new Card(null, playerId));
            }
        }
        posSetter[playerId](this.cards);
        this.playerId = playerId;
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

    getSelectedCount () {
        var count = 0;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].element.classList.contains('selected')) {
                count++;
            }
        }
        return count;
    }
}

function selectCard (e) {
    if (e.currentTarget.getAttribute('playerId') != 0) {
        return;
    }
    if (e.currentTarget.classList.contains('selected')) {
        e.currentTarget.classList.remove('selected');
        parseInt(e.currentTarget.style.top, 10)
        e.currentTarget.style.top = parseInt(e.currentTarget.style.top, 10) + cardPostitionSetting.cardSelected + 'px';
    } else {
        const upper = selectedUpperBound[currentState];
        if (sets.first.getSelectedCount() < upper) {
            // passingBtnWrapper.enableDisplay(false);
            e.currentTarget.classList.add('selected');
            e.currentTarget.style.top = parseInt(e.currentTarget.style.top, 10) - cardPostitionSetting.cardSelected + 'px';
        } else {
            passingBtnWrapper.enableDisplay(true);
        }
    }
}
