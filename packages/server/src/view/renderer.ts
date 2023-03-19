// @ts-ignore
const socket = io();

const BASE_URL = 'http://localhost:3000'

const logBox = document.getElementById('log-box')! as HTMLDivElement;
const button = document.getElementById('btn-run-test')! as HTMLButtonElement;
const selectTestName = document.getElementById('select-test-name')! as HTMLSelectElement;
const optionOpenBrowser = document.getElementById('option-open-browser')! as HTMLInputElement;
const optionDebug = document.getElementById('option-debug')! as HTMLInputElement;
const optionReport = document.getElementById('option-report')! as HTMLInputElement;
const formAuth = document.getElementById('auth')! as HTMLFormElement;
const btnRefreshTests = document.getElementById('btn-refresh-tests')! as HTMLButtonElement;
const btnCodegen = document.getElementById('btn-codegen')! as HTMLButtonElement;
const inputCodegenUrl = document.getElementById('input-codegen-url')! as HTMLInputElement;

const createOption = (value: string) => {
    const option = document.createElement('option')
    option.value = value;
    option.innerText = value;
    return option;
}

const getTests = async () => fetch(BASE_URL + '/tests')
    .then(data => data.json())
    .then((names: string[]) => {
        selectTestName.innerHTML = '';
        ['모두 실행', ...names].forEach((name) => {
            selectTestName.appendChild(
                createOption(name)
            );
        })
    })

formAuth.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement);
    const formProps = Object.fromEntries(formData);
    const res = await fetch(BASE_URL + '/set-auth', {
            method: 'post',
            body: JSON.stringify({
                username: formProps.username,
                password: formProps.password
            })
        }
    );
    if (res) alert('등록 완료')
});

button.addEventListener('click', () => {
    const testName = selectTestName.value;
    const openBrowser = optionOpenBrowser.checked;
    const useDebug = optionDebug.checked;
    const showReport = optionReport.checked;
    socket.emit('run test', testName, {openBrowser, useDebug, showReport});
})

btnRefreshTests.addEventListener('click', async () => {
    const response = await fetch(BASE_URL + '/start-analyze')
    const result = await response.json()
    if (result) {
        await getTests();
        alert('갱신 완료')
    }
})

btnCodegen.addEventListener('click', () => {
    const url = inputCodegenUrl.value;
    fetch(BASE_URL + `/codegen?url=${url}`);
})

socket.on('test log', (msg: string) => {
    logBox.innerHTML += msg
        .replace(/\n/g, '<br/>')
        .replace(' ', '&nbsp;');
})

socket.on('set auth done', () => alert('done'));

void getTests();
