// @ts-ignore
const socket = io();

const BASE_URL = 'http://localhost:3000'

let isTesting = false;

const logBox = document.getElementById('log-box')! as HTMLDivElement;
const button = document.getElementById('btn-run-test')! as HTMLButtonElement;
const selectTestName = document.getElementById('select-test-name')! as HTMLSelectElement;
const optionOpenBrowser = document.getElementById('option-open-browser')! as HTMLInputElement;
const optionDebug = document.getElementById('option-debug')! as HTMLInputElement;
const optionReport = document.getElementById('option-report')! as HTMLInputElement;
const formAuth = document.getElementById('auth')! as HTMLFormElement;
const btnRefreshTests = document.getElementById('btn-refresh-tests')! as HTMLButtonElement;
const btnCodegen = document.getElementById('btn-codegen')! as HTMLButtonElement;
const btnClearLog = document.getElementById('btn-clear-log')! as HTMLButtonElement;
const inputCodegenUrl = document.getElementById('input-codegen-url')! as HTMLInputElement;

const addLog = (msg: string, goToBottom = true) => {
    logBox.innerHTML += msg
        .replace(/\n/g, '<br/>')
        .replace(' ', '&nbsp;');
    if (goToBottom) logBox.scrollIntoView({block: "end"});
}

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
        ['all', ...names].forEach((name) => {
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
    if (isTesting) return alert('테스트가 진행중입니다')
    else isTesting = true;


    const testName = selectTestName.value;
    const openBrowser = optionOpenBrowser.checked;
    const useDebug = optionDebug.checked;
    const showReport = optionReport.checked;
    addLog(`\n=========테스트 시작: ${new Date().toLocaleString('kr')} / [${testName}]=========\n\n`)
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

btnClearLog.addEventListener('click', () => {
    logBox.innerText = '';
})

btnCodegen.addEventListener('click', () => {
    const url = inputCodegenUrl.value;
    fetch(BASE_URL + `/codegen?url=${url}`);
})

socket.on('test log', (msg: string) => {
    addLog(msg)
})

socket.on('test log ended', () => {
    isTesting = false;
    addLog('\n=========테스트 종료됨=========\n\n')
})

socket.on('set auth done', () => alert('done'));

void getTests();
