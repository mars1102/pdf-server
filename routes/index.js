const querystring = require('node:querystring')
const puppeteer = require('puppeteer');
const router = require('koa-router')()

const buildPdf = async (url) => {
  // 启动无头浏览器
  const browser = await puppeteer.launch();
  try {
    // new一个Tab
    const page = await browser.newPage();
    // 设置窗口大小
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    // 跳转页面
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 0
    });
    return await page.pdf({
      margin: {
        top: 50,
        bottom: 50,
        left: 0,
        right: 0
      },
      displayHeaderFooter: false,
      printBackground: true,
    });
  } catch (e) {
    throw e;
  } finally {
    browser.close();
  }
}

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/pdf', async (ctx, next) => {
  const url = querystring.parse(ctx.request.search.slice(1)).url
  const pdf = await buildPdf(url)

  ctx.set('Content-Type', 'application/pdf');
  ctx.set('Content-Length', pdf.length);
  ctx.body = pdf;
})

module.exports = router
