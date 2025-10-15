const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.text({ type: 'text/html', limit: '5mb' }));

app.post('/pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(req.body, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to generate PDF');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`PDF server on port ${PORT}`));
