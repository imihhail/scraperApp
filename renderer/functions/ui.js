const loadingLine = document.querySelector('.loading-line')
const minBtn      = document.getElementById('minBtn');
const closeWin    = document.getElementById('closeWin');


function disableUI() {
  if (closeBtn[0]) closeBtn[0].parentNode.remove()
  
  loadingLine.style.animationName = 'loading' 
  errorContainer.style.display    = "none"
  output.textContent              = "Loading..."
  timeLeft.textContent            = ""
  startBtn.disabled               = true
  folderBtn.disabled              = true

  document.body.classList.add('loading')
}

function enableUI() {
  document.body.classList.remove('loading')

  loadingLine.style.animationName = ''
  startBtn.disabled               = false
  folderBtn.disabled              = false
}


// Track user input like in react
urlInput.addEventListener     ('input', inputCheck)
fileNameInput.addEventListener('input', inputCheck)

function inputCheck() {
  if (urlInput.value == "" || fileNameInput.value == "" || folderPath == undefined) {
    startBtn.disabled = true
  }
  else {
    startBtn.disabled = false
  }
}


// MINIMIZE AND CLOSE WINDOW
minBtn.addEventListener('click', () => {
  window.winapi.minimize()
})

closeWin.addEventListener('click', () => window.winapi.close());