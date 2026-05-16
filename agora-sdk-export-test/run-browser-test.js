const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 捕获控制台输出
  page.on("console", (msg) => console.log("[BROWSER]", msg.text()));
  page.on("pageerror", (err) => console.log("[BROWSER ERROR]", err.message));

  await page.goto("http://localhost:5173");
  await page.waitForSelector("#testBtn");
  await page.click("#testBtn");

  // 等待结果出现（等待 "跨模块 enum 对比" 文本）
  await page.waitForFunction(
    () => document.getElementById("output").textContent.includes("跨模块 enum 对比"),
    { timeout: 30000 }
  );

  const result = await page.$eval("#output", (el) => el.textContent);
  console.log("\n===== 测试结果 =====\n" + result);

  await browser.close();
})();
