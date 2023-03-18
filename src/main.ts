const {app} = require('electron');
const ipcMain = require('electron').ipcMain;

const {createWindow} = require('./window');
const {runE2eTest} = require('./scripts');

let win;

app.whenReady().then(() => {
    win = createWindow()
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('runE2eTest', (channel, listener) => {
    runE2eTest(channel, listener);
})
