export {
    onActionMessage,
    onWindowResize,
};
import {
    getAction,
    sets,
} from './machine';


function onActionMessage (e) {
    const msg = JSON.parse(e.data);
    console.log(msg);
    const action = getAction(msg.state);
    action(msg);
}

function onActionResponse () {
    
}

function onWindowResize () {
    const s = Object.values(sets);
    for (let i = 0; i < s.length; i++) {
        s[i].resetPos();
    }
}
