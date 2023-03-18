console.log('loaded')

const appContainer = document.getElementById('app')!;

document.getElementById('run-test')
    ?.addEventListener('click', () => {
        const child = document.createElement('div');
        child.textContent = 'hi!';
        appContainer.appendChild(child)
    });
