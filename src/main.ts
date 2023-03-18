const {app, BrowserWindow} = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadFile('dist/index.html');
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools()
    }
}

app.whenReady().then(() => {
    createWindow()
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
