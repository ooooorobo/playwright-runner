// @ts-ignore
const socket = io();

const logBox = document.getElementById('log-box')! as HTMLDivElement;
const button = document.getElementById('btn-run-test')! as HTMLButtonElement;

const ansiMatcher = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

button.addEventListener('click', () => {
    socket.emit('run test');
})

socket.on('test log', (msg: string) => {
    console.log(msg)
    logBox.innerHTML += msg
        .replace(/\n/g, '<br/>')
        .replace(' ', '&nbsp;');
})
