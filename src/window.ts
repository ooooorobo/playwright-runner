import {BrowserWindow} from "electron";
import nodePath from "path";

module.exports = {
    createWindow: () => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: nodePath.join(__dirname, 'preload.js')
            }
        })

        win.loadFile('dist/index.html');

        if (process.env.NODE_ENV === 'development') {
            win.webContents.openDevTools()
        }

        return win;
    }
}
