const errorContainer = document.getElementById('errorContainer');
const errorMsg       = document.querySelector('.errorMsg-box')
const closeBtn       = document.querySelector('.closeErrorBtn')


// ALERT ERROR
function alertMessage(message, alertDuration, resetOutput) {
  folderBtn.disabled = false
  
  if (closeBtn[0]) closeBtn[0].parentNode.remove()

  if (resetOutput) {
    progressText.textContent = "Welcome to WebScraper!"
    timeLeft.textContent     = "Version 1.0"
  }

  errorContainer.style.display = "flex"
  errorMsg.innerHTML = message

  if (alertDuration != -1) {
    setTimeout(() => {
      errorContainer.style.display = "none"
    }, alertDuration);
  }

  window.api.notifyEvent()
}


closeBtn.addEventListener('click', closeErrorBox)

function closeErrorBox() {
  errorContainer.style.display = "none"
}