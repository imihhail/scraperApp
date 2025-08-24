const startBtn      = document.getElementById('startBtn');
const urlInput      = document.getElementById('urlInput')
const fileNameInput = document.getElementById('fileNameInput');
const delayInp      = document.getElementById('delayInput');
const folderText    = document.querySelector('.folderOutput')
let progressText    = document.getElementById('output')


let folderPath
let pagesVisited

// START
startBtn.addEventListener('click', handleStartClick);

async function handleStartClick() {
  const url         = urlInput.value.trim()
  const scrapeDelay = delayInp.value.trim() * 1000
  const fileName    = await checkFileExistance()
  const outputPath  = `${folderPath}\\${fileName}.csv`

  if (fileName === null) {
    enableUI()
    return
  }

  disableUI()
  firstUpdate = false
  
  startScraping.sendURL(url, outputPath, scrapeDelay)

  await waitForResult()
}

// PAUSE
async function handlePauseClick() {
  disableUI()

  output.textContent = 'Finishing last extraction...'

  await cancelExtraction.pauseScrapings()

  startBtn.removeEventListener('click', handlePauseClick);
  startBtn.addEventListener   ('click', handleResumeClick);
}

// PAUSE NOTIFICATION
 async function pauseNotification(boolean) {
  const data           = await window.storeAPI.get('scrapeData')
  const fileLocation   = await modifyFolderLocation(data.fileLocation)

  timeLeft.textContent = ""
  startBtn.innerText   = "Resume"
  startBtn.disabled    = boolean
  startBtn.style.backgroundColor = 'rgb(76, 175, 79)'

  if (boolean) {
    output.textContent = `Continue extracting at ${data.pagesVisited + 1} page.\nData saved: ${fileLocation}`
  }
  else {
    output.textContent = `Extraction paused and data saved into:\n${fileLocation}`
  }
  
  output.title         = data.fileLocation

  document.body.classList.remove('loading');
}

// RESUME AFTER PAUSE 
async function handleResumeClick() {
  disableUI()

  firstUpdate = false
  
  const data  = await window.storeAPI.get('scrapeData')

  startScraping.sendURL(data.lastPage, data.fileLocation, data.scrapeDelay)

  waitForResult()
}

// RETURN RESULT
async function waitForResult() {
    const result = await new Promise(resolve => {
    api.once('scrapeError',      errorMsg => resolve({ error: errorMsg }))
    api.once('scrapeComplete', successMsg => resolve({ success: successMsg }))
    api.on  ('scrapePaused',     pauseMsg => resolve({ pause: pauseMsg }))
  })

  enableUI()
  
  if (result.error) {
    if (result.error === 'elementNotFound') {
      if (firstUpdate) {
        alertMessage('URL got expired', -1, false)
        urlInput.value = ""
        
        await pauseNotification(true)

        startBtn.removeEventListener('click', handlePauseClick)
        startBtn.addEventListener   ('click', handleStartClick)
      }
      else {
        alertMessage('Invalid URL', 5000, true)
      }
    }
    else if (result.error === 'BrowserManuallyClosed') {
      alertMessage('Browser was closed manually', -1, false)

      await pauseNotification(false)

      startBtn.removeEventListener('click', handleStartClick)
      startBtn.addEventListener   ('click', handleResumeClick)
    }
    else if (result.error === 'BrowserInstantlyClosed') {
      alertMessage('Browser was closed manually', 5000, true)
    }
    else if (result.error === 'Invalid URL') {
      alertMessage('Invalid URL', 5000, true)
    }
    else {
      alertMessage(result.error, -1, true)
    }
  }
  else if (result.pause) {    
    await pauseNotification(false)
  }

// EXTRACTION COMPLETE
  else {    
    urlInput.value       = ""
    delayInp.value       = ""
    startBtn.innerText   = "Start new"
    startBtn.disabled    = true
    firstUpdate          = false
    
    output.textContent   = 'Extraction complete! Data saved into:'
    timeLeft.textContent = `${folderText.textContent}\\${fileNameInput.value}.csv`
    fileNameInput.value  = ""

    startBtn.style.backgroundColor = 'rgb(76, 175, 79)'

    startBtn.removeEventListener('click', handleResumeClick)
    startBtn.addEventListener   ('click', handleStartClick)

    window.api.notifyEvent()
    
    setProgress(1, 1)
  }
}
