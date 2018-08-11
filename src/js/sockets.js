export {
    Sockets
};
import {
    on_action_message
} from './action';


const Sockets = {
    action: new WebSocket('ws://' + location.host + '/action'),
};

Sockets.action.onmessage = on_action_message;
