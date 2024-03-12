const fs = require('node:fs');
const {PDFDocument} = require('pdf-lib');

async function splitPdfToSinglePages(pdfBuffer) {
  // 加载原始PDF文档
  const originalPdfDoc = await PDFDocument.load(pdfBuffer);

  // 获取原始PDF文档的页数
  const numberOfPages = originalPdfDoc.getPageCount();

  // 循环每一页，并创建包含单页的新PDF文档
  for (let i = 0; i < numberOfPages; i++) {
    // 创建一个新的PDF文档
    const singlePagePdfDoc = await PDFDocument.create();
    // 向新文档中复制当前页
    const [copiedPage] = await singlePagePdfDoc.copyPages(originalPdfDoc, [i]);
    // 将复制的页添加到新文档中
    singlePagePdfDoc.addPage(copiedPage);

    // 将新文档保存为PDF Buffer
    const pdfBytes = await singlePagePdfDoc.save();

    // 将PDF Buffer写入到文件系统中（这里需要一个有效的文件路径）
    fs.writeFileSync(`page_${i + 1}.pdf`, pdfBytes);
  }
}
