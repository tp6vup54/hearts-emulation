export {
    Sockets,
};
import {
    onActionMessage,
} from './action';


const Sockets = {
    action: new WebSocket('ws://' + location.host + '/action'),
};

Sockets.action.onmessage = onActionMessage;
