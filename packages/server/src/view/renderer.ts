const logBox = document.getElementById('log-box')! as HTMLDivElement;
const button = document.getElementById('btn-run-test')! as HTMLButtonElement;

button.addEventListener('click', () => {
    logBox.innerText += 'clicked' + '\n';
})
