const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

const ipc = {
    'render': {
        'send': [
            'runE2eTest'
        ],
        'receive': ['runE2eTestLog'] as string[],
        'sendReceive': [] as string[]
    }
}

contextBridge.exposeInMainWorld(
    'ipcRender', {
        // From render to main.
        send: (channel: string, args: any[]) => {
            let validChannels = ipc.render.send;
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, args);
            }
        },
        // From main to render.
        receive: (channel: string, listener: Function) => {
            let validChannels = ipc.render.receive;
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`.
                ipcRenderer.on(channel, (event, ...args) => listener(...args));
            }
        },
        // From render to main and back again.
        invoke: (channel: string, args: any[]) => {
            let validChannels = ipc.render.sendReceive;
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
)

