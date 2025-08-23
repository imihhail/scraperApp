const folderBtn = document.getElementById('choose-folder');


// SELECT FOLDER
let previousLocation = undefined

folderBtn.addEventListener('click', async () => {
  folderPath = await window.folderSelector.selectFolder()

  if (closeBtn[0]) closeBtn[0].parentNode.remove()
  
  if (folderPath) {
    const newPath          = modifyFolderLocation(folderPath)
    previousLocation       = folderPath
    folderText.textContent = ""
    folderText.title       = ""
    folderText.innerHTML   = `${newPath}`
    folderText.title       = folderPath
     
    inputCheck()
  } 
  else {
    folderPath = previousLocation
  }
})


// SHORTEN FOLDER LOCATION NAME
function modifyFolderLocation(fileLocation) {
    const pathLen = folderPath.length
  
    if (pathLen > 42) {
      const maxStrLen     = 37
      const reducedLen    = pathLen - maxStrLen
      const shortenedPath = fileLocation.slice(reducedLen)
      const newPath       = shortenedPath.slice(shortenedPath.indexOf('\\'));// <-------- MIGHT NOT WORK ON MAC, BECAUSE MAC HAS "/" INSTEAD OF "\"
  
      return `...${newPath}`
    }
    else {
      return fileLocation
    }
  }


// FILE EXISTANCE CHECK
async function checkFileExistance() {
    if (!folderPath) return null
  
    const fileName = (fileNameInput.value.trim() || 'MyFile')
    const exists   = await window.folderSelector.checkFileExists(folderPath, fileName)
  
    if (exists) {
      const fullPath  = `${folderPath}\\${fileName}.csv`
      const overwrite = await window.folderSelector.confirmOverwrite(fullPath)
  
      loadingLine.style.animationName = ''
  
      return overwrite ? fileName : null
    }
    else {
      return fileName
    }
  }