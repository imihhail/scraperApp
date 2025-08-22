const loadingLine = document.querySelector('.loading-line')


function disableUI() {
    if (closeBtn[0]) closeBtn[0].parentNode.remove()
    
    output.textContent = "Loading..."
    startBtn.disabled  = true
    folderBtn.disabled = true
  
    document.body.classList.add('loading')
    loadingLine.style.animationName = 'loading' 
  }

  function enableUI() {
    document.body.classList.remove('loading')

    loadingLine.style.animationName = ''
    startBtn.disabled               = false
    folderBtn.disabled              = false
  }