console.log('loaded renderer')

const logBox: HTMLDivElement = document.getElementById('log')! as HTMLDivElement;

const renderer = (window as any).ipcRender;

document.getElementById('run-test')
    ?.addEventListener('click', () => {
        const eventName = 'runE2eTestLog'
        renderer.receive(eventName, (data: any) => {
            logBox.innerHTML += data + '<br/>'
        })
        renderer.send('runE2eTest', {eventName});
    });
