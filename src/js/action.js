export {
    onActionMessage,
    onWindowResize,
};
import {
    CardSet,
} from './cards';


const setName = ['first', 'second', 'third', 'forth'];
const sets = [];

function onActionMessage(e) {
    const msg = JSON.parse(e.data);
    console.log(msg);
    const app = document.querySelector('#app');
    for (let i = 0; i < setName.length; i++) {
        sets.push(new CardSet(i, msg[setName[i]]));
    }
    for (let i = 0; i < sets.length; i++) {
        const elements = sets[i].getRenderedElement();
        for (let j = 0; j < elements.length; j++) {
            app.appendChild(elements[j]);
        }
    }
}

function onWindowResize() {
    for (let i = 0; i < sets.length; i++) {
        sets[i].resetPos();
    }
}
