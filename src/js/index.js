import {
    Socket,
} from './sockets';
import {
    onWindowResize,
} from './action';

async function main () {
    window.addEventListener('resize', onWindowResize);
}

main()
