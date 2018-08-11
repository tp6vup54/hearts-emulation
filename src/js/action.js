export {
    on_action_message,
};
import {
    generateCard,
} from './cards';


function on_action_message(e) {
    const msg = JSON.parse(e.data);
    console.log(msg);
    const app = document.querySelector('#app');
    for (let i = 0; i < msg.My.length; i++) {
        app.appendChild(generateCard(msg.My[i]));
    }
}
