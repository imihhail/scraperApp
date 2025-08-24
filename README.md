# Desktop WebScraper

### Author: Ivar Mihhailov 

## Description

Project objective is to create user friendly desktop webscraper app. Originally it was ment to scrape another website, but in this demo version, it works on dummy webscraping website: https://quotes.toscrape.com/js/. If you decide to pause the extraction then you can continue later by entering URL: https://quotes.toscrape.com/js/page/2/ or any page number which is available on website.

# Usage: how to run ?

1. Open root folder and type command: npm install

2. To test it in developer mode type command: npx electronmon .

3. To acutally create desktop application, type command: npx electron-packager . WebScrper --platform=win32 --arch=x64 --out=dist --overwrite 

4. dist folder will be created. Inside the folder is .exe file named WebScraper
