// @ts-ignore
const socket = io();

const logBox = document.getElementById('log-box')! as HTMLDivElement;
const button = document.getElementById('btn-run-test')! as HTMLButtonElement;
const selectTestName = document.getElementById('select-test-name')! as HTMLSelectElement;

const createOption = (value: string) => {
    const option = document.createElement('option')
    option.value = value;
    option.innerText = value;
    return option;
}

fetch('http://localhost:3000/tests')
    .then(data => data.json())
    .then((names: string[]) => {
        selectTestName.innerHTML = '';
        names.forEach((name) => {
            selectTestName.appendChild(
                createOption(name)
            );
        })
    })

button.addEventListener('click', () => {
    const testName = selectTestName.value;
    socket.emit('run test', testName);
})

socket.on('test log', (msg: string) => {
    console.log(msg)
    logBox.innerHTML += msg
        .replace(/\n/g, '<br/>')
        .replace(' ', '&nbsp;');
})
