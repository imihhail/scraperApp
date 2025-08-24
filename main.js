import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';


const store    = new Store();
let scrapeData = {}

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

let win
function createWindow() {
   win = new BrowserWindow({
    title: 'WebScraper',
    width: 445,
    height: 580,
    resizable: false, 
    maximizable: false,     
    fullscreenable: false,  
    backgroundColor: '#00000000',
    fullscreen: false,     
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js')
    },
  }) 
  win.loadFile('./renderer/index.html')

  //win.webContents.openDevTools();
  Menu.setApplicationMenu(null)
}

app.whenReady().then(createWindow)

ipcMain.handle('window-minimize', () => {
  win.minimize()
});

ipcMain.handle('window-close', () => win.close());

// NOTIFY ON TASKBAR
ipcMain.handle('notify-event', () => {
  if (!win) return;
  win.flashFrame(true);

  if (process.platform === 'darwin') {
    app.dock.bounce(); 
  }
});

// OVERWRITE CONFIRMATION WINDOW
ipcMain.handle('confirm-overwrite', async (e, filePath) => {
  const { response } = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 1,
    cancelId: 1,
    noLink: true, 
    title: 'File exists',
    message: `A file named "${path.basename(filePath)}" already exists. Would you like to continue writing on this file?`
  });

  return response === 0 
})

// EXPOSE FOLDER PATH
ipcMain.handle('select-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select a folder...',
    properties: ['openDirectory']
  });
  
  if (canceled || !filePaths.length) return ""
  return filePaths[0]
});

// CHECK EXISTING FILE NAMES
ipcMain.handle('check-file-exists', (event, folder, fileName) => {
  const fullPath = path.join(folder, fileName + '.csv');
  return fs.existsSync(fullPath); 
});


// CATCH MESSAGES FROM SELENIUM
ipcMain.on('scrapeError', (e, msg) => {
  store.set('scrapeData', scrapeData)
  e.sender.send('scrapeError', msg)
})

ipcMain.on('scrapeEnded', (e, msg) => {
  if (msg == "scrapePaused") {
    store.set('scrapeData', scrapeData);
    e.sender.send('scrapePaused', msg)
  }
  else if (msg == "scrapeComplete") {
    store.delete('scrapeData'); 
    e.sender.send('scrapeComplete', msg)
  }
})

ipcMain.on('scrapeProgress', (e, count) => {
  scrapeData = count
  e.sender.send('scrapeProgress', count)
})

// Storage
ipcMain.handle('getStoreData', (e, key) => {
  return store.get(key)
})




// Closes on all OS systems, instead of minimazing
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
