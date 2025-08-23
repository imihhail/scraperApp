const progressBar = document.getElementById('progressBar');
const percentage  = document.getElementById('progressText');


// UPDATE PROGRESS
let currentProgress = 1
let firstUpdate     = false
let totalResults


api.on('scrapeProgress', (data) => {
  value = data.pagesVisited
  setProgress(data.pagesVisited, data.totalResults)

  let progressStep     = 100 / data.totalResults
  currentProgress      = currentProgress  + progressStep
  let pagesLeft        = data.totalResults - data.pagesVisited
  let totalTimeSeconds = pagesLeft * (data.scrapeDelay / 1000)
  const timeString     = formatHMS(totalTimeSeconds)
  timeLeft.textContent = `Estimated time left: ${timeString}`

  if (!firstUpdate) {
    startBtn.removeEventListener('click', handleResumeClick)
    startBtn.removeEventListener('click', handleStartClick)
    startBtn.addEventListener   ('click', handlePauseClick)

    startBtn.style.backgroundColor  = '#34ad99ff'
    startBtn.innerText              = "Pause"
    output.textContent              = "Extracting..."
    
    enableUI()
  }
  
  firstUpdate = true
})

// PROGRESSBAR
function setProgress(current, total) {
  let pct = current / total
  pct     =  Math.floor(100 * pct)

  progressBar.setAttribute('aria-valuenow', pct);
  
  progressBar.style.width = `${pct}%`;
  percentage.textContent  = `${Math.round(pct)}%`;
}

// Convert seconds to hours and minutes
function formatHMS(sec) {
  const hours   = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}