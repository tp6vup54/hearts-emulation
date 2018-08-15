export {
    onActionMessage,
    onWindowResize,
};
import {
    getAction,
    sets,
} from './machine';


async function onActionMessage (e) {
    const msg = JSON.parse(e.data);
    console.log(msg);
    const action = await getAction(msg.state);
    action(msg);
}

function onActionResponse () {
    
}

async function onWindowResize () {
    const s = Object.values(sets);
    for (let i = 0; i < s.length; i++) {
        s[i].resetPos();
    }
}
