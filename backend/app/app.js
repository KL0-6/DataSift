const express = require('express')
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

const app = express()

app.get('/api/scrape', function (req, res) {
  console.log(req.query);
  console.log(req.query.website);
  
  let driver = new webdriver.Builder()
  .forBrowser(webdriver.Browser.CHROME)
  .setChromeOptions(/* ... */)
  .build();

  driver.get(req.query["website"]);
})

app.listen(3000)