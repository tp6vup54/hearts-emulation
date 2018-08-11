export {
    generateCard,
};


const chars = {
    'J': 'jack',
    'Q': 'queen',
    'K': 'king',
    'A': 'ace',
    'T': '10',
};

const suits = {
    'S': 'spades',
    'H': 'hearts',
    'D': 'diamonds',
    'C': 'clubs',
};

function getCardImgName(s) {
    var name = '/img/';
    if (s[0] in chars) {
        name += chars[s[0]];
    } else {
        name += s[0];
    }
    name += '_of_' + suits[s[1]] + '.png';
    return name
}

function generateCard(s) {
    const div = document.createElement('div');
    div.setAttribute('class', 'card');
    const img = document.createElement('img');
    img.setAttribute('src', getCardImgName(s));
    div.appendChild(img);
    return div;
}
