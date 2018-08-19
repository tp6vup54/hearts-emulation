export {
    onActionMessage,
    onWindowResize,
};
import {
    getState,
    sets,
} from './machine';


async function onActionMessage (e) {
    const msg = JSON.parse(e.data);
    console.log(msg);
    const state = await getState(msg.state);
    await state.action(msg);
}

function onActionResponse () {
    
}

async function onWindowResize () {
    const s = Object.values(sets);
    for (let i = 0; i < s.length; i++) {
        s[i].resetPos();
    }
}
