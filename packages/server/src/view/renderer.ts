// @ts-ignore
const socket = io();

const logBox = document.getElementById('log-box')! as HTMLDivElement;
const button = document.getElementById('btn-run-test')! as HTMLButtonElement;
const selectTestName = document.getElementById('select-test-name')! as HTMLSelectElement;
const optionOpenBrowser = document.getElementById('option-open-browser')! as HTMLInputElement;
const formAuth = document.getElementById('auth')! as HTMLFormElement;

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

formAuth.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement);
    const formProps = Object.fromEntries(formData);
    socket.emit('set auth', formProps.username, formProps.password);
});


button.addEventListener('click', () => {
    const testName = selectTestName.value;
    const openBrowser = optionOpenBrowser.checked;
    socket.emit('run test', testName, openBrowser);
})

socket.on('test log', (msg: string) => {
    console.log(msg)
    logBox.innerHTML += msg
        .replace(/\n/g, '<br/>')
        .replace(' ', '&nbsp;');
})

socket.on('set auth done', () => alert('done'));
