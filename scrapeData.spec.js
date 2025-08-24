import { By, Builder } from 'selenium-webdriver';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { NoSuchElementError, TimeoutError, SessionNotCreatedError, InvalidArgumentError, NoSuchSessionError, NoSuchWindowError, WebDriverError, InvalidSelectorError } from 'selenium-webdriver/lib/error.js';


let isPaused = false


export async function scrapeData(url, filePath, delayInp, onEvent = () => {}) {  
  let driver
  const scrapeDelay = delayInp == "" ? 10000 : Number(delayInp)
  
  isPaused = false

  try {
    driver = await new Builder().forBrowser('chrome').build()

    await driver.get(url)

    let currentPageNr = await getCurrentPageNr(url)

    while (currentPageNr < 10) {
      const quotesData = []

      if (isPaused) {
        onEvent({ type: 'paused' })
        break
      }

      const quotesClass  = await driver.findElements(By.css('.text'))
      const authorsClass = await driver.findElements(By.css('.author'))

      for (let i = 0; i < quotesClass.length; i++) {
        const quoteText  = await quotesClass[i].getText()
        const authorText = await authorsClass[i].getText()

        quotesData.push({
          quote: quoteText.trim(),
          author: authorText.trim()
        })
      }

      await writeData(filePath, quotesData)

      const url         = await driver.getCurrentUrl()
      currentPageNr     = await getCurrentPageNr(url)                          
      const nextButton  = await driver.findElements(By.css('.next a'))

      if (nextButton.length === 0) {
        onEvent({ type: 'complete' })
        break
      }

      const nextPageURL = await nextButton[0].getAttribute('href')

      if (typeof onEvent === 'function') {
        const scrapeData = {
          scrapeDelay : scrapeDelay,
          pagesVisited: currentPageNr,
          totalResults: 10,
          fileLocation: filePath,
          lastPage    : nextPageURL
        }

        onEvent({ type: 'progress', scrapeData: scrapeData })
      }

      await driver.sleep(scrapeDelay)

      await nextButton[0].click()
    }
    
  } catch (e) {
    console.log(e);

    if (e instanceof NoSuchElementError || e instanceof InvalidSelectorError) {
      throw new Error("elementNotFound");
    }
    else if (e instanceof TimeoutError) {
      throw new Error("Page was loading too long");
    }
    else if (e instanceof SessionNotCreatedError) {
      throw new Error("Session not created");
    }
    else if(e instanceof InvalidArgumentError) {
      throw new Error("Invalid URL");
    }
    else if(e instanceof NoSuchSessionError ) {
      throw new Error("BrowserManuallyClosed");
    }
    else if (e instanceof NoSuchWindowError ) {
      throw new Error("BrowserInstantlyClosed")
    }
    else if (e instanceof WebDriverError) {
      if (e.message.includes('ERR_INTERNET_DISCONNECTED')) {
        throw new Error("Connection Error")
      }
    }
    else {
      throw new Error('Unexpected error');
    }
  } finally {
      if (driver) await driver.quit()  
  }
}


async function getCurrentPageNr(url) {
  const pageNr = url.match(/\/page\/(\d+)(?:\/|$)/i) 
  return pageNr ? Number(pageNr[1]) : 1   
}


export const pauseScraping = () => isPaused = true


async function writeData(filePath, quotesData) {
  const fileExists = fs.existsSync(filePath)

  const csvWriter  = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'quote', title: 'Quote' },
      { id: 'author', title: 'Author' }
    ],
    append: fileExists
  });

  await csvWriter.writeRecords(quotesData);
}