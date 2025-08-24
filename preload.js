import { contextBridge, ipcRenderer } from 'electron';
import { scrapeData, pauseScraping } from './scrapeData.spec.js';


// FOLDER SELECTOR
contextBridge.exposeInMainWorld('folderSelector', {
  selectFolder     : () => ipcRenderer.invoke('select-folder'),
  checkFileExists  : (folder, fileName) => ipcRenderer.invoke('check-file-exists', folder, fileName),
  confirmOverwrite : (filePath) => ipcRenderer.invoke('confirm-overwrite', filePath)
});

// Start scraping and send messages to renderer
const validChannels = ['scrapeError', 'scrapeComplete', 'scrapeProgress', 'scrapeResume', 'scrapePaused'];

contextBridge.exposeInMainWorld('startScraping', {
  sendURL: async (url, outputPath, scrapeDelay) => {
    try {
      await scrapeData(url, outputPath, scrapeDelay, (event) => {
        if (event.type === 'progress') {
          ipcRenderer.send('scrapeProgress', event.scrapeData);
        } else if (event.type === 'complete') {
          ipcRenderer.send('scrapeEnded', 'scrapeComplete');
        } else if (event.type === 'paused') {          
          ipcRenderer.send('scrapeEnded', 'scrapePaused');
        }
      })
    } catch(err){
      ipcRenderer.send('scrapeError', err.message)
    }
  }
})

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  once: (channel, fn) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, (e, args) => fn(args));
    }
  },
  on: (channel, fn) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (e, args) => fn(args));
    }
  },
  notifyEvent: () => ipcRenderer.invoke('notify-event')
});

// Storage
contextBridge.exposeInMainWorld('storeAPI', {
  get: (data) => ipcRenderer.invoke('getStoreData', data),
  //set: (key, value) => ipcRenderer.invoke('set-store-data', key, value),
})

contextBridge.exposeInMainWorld('cancelExtraction', {
  pauseScrapings: () => pauseScraping()
})


contextBridge.exposeInMainWorld('winapi', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close:    () => ipcRenderer.invoke('window-close'),
});


