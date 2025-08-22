const closeBtn = document.getElementsByClassName('toast-close')

// ALERT ERROR
function alertMessage(message, alertDuration, color) {
    folderBtn.disabled = false
    
    if (closeBtn[0]) closeBtn[0].parentNode.remove()
      
    isErrorToastVisible = true;
    Toastify.toast({
      id: 'test',
      text: message,
      duration: alertDuration,
      close: true,
      style: {
        background: color,
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        padding: '3px',
      }
    });
  }