import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createServer } from "vite";
import type { ViteDevServer } from "vite";
import { launch } from "puppeteer";
import type { Browser, Page } from "puppeteer";
import path from "path";

const PORT = 3000;

describe("basic", async () => {
  let server: ViteDevServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await createServer({ root: path.resolve(process.cwd(), "tests") });
    browser = await launch({ headless: "new" });
    page = await browser.newPage();

    await server.listen(PORT);
  });

  afterAll(async () => {
    await browser.close();
    await server.close();
  });

  test("should have the correct title", async () => {
    await page.goto(`http://localhost:${PORT}`);

    const titleHandle = (await page.$("title"))!;
    const title = await page.evaluate((t) => t.text, titleHandle);

    expect(title).toBe("Enhanced HTML");
  });
});
