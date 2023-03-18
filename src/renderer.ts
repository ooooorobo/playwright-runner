console.log('loaded renderer')

const appContainer = document.getElementById('app')!;
const logBox: HTMLTextAreaElement = document.getElementById('log')! as HTMLTextAreaElement;

const ipcr = (window as any).ipcRender;

document.getElementById('run-test')
    ?.addEventListener('click', () => {
        const eventName = 'runE2eTestLog'
        ipcr.receive(eventName, (data: any) => {
            logBox.value += data + '\n'
        })
        ipcr.send('runE2eTest', {eventName});
    });
