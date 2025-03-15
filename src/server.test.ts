import {describe, it, after, before} from "node:test";//テスト用関数
import assert from "node:assert";//値を比較する検証機能
import {spawn} from "node:child_process";//子プロセス実行モジュール
import {setTimeout} from "node:timers/promises";//非同期

//デフォルト環境変数 //??はnullの時のみ54321
const port = process.env.PORT ?? 54321;

//サーバーの URL を設定 //テスト時、下記にリクエストを送る
const SERVER_ORIGIN = `http://localhost:${port}`;

let server; //サーバーの子プロセスを格納
let closedPromise;//サーバーが終了時Promise(after)で使用

describe("a server", () => {
  before(async () => {//テスト実行前にサーバー起動
    server = spawn(`PORT=${port} npm run start`, {
      shell: true,
      detached: true,
    });
    closedPromise = new Promise((resolve) => server.on("close", resolve));
    await setTimeout(1000);
  });
  it("returns a valid JSON for /sample.json", async () => {
    const response = await fetch(`${SERVER_ORIGIN}/sample.json`);
    assert.equal(response.status, 200);
    assert.ok(response.ok);
    const result = await response.json();
    assert.deepStrictEqual(result, {message: "ok"});
  });

  it("returns a html for /hello.html", async () => {
    const response = await fetch(`${SERVER_ORIGIN}/hello.html`);
    assert.equal(response.status, 200);
    assert.ok(response.ok);
    const mimeType = response.headers.get("content-type");
    assert.equal(mimeType.toLowerCase(), "text/html");
  });

  it("returns a jpeg for /wanko.jpg", async () => {
    const response = await fetch(`${SERVER_ORIGIN}/wanko.jpg`);
    assert.equal(response.status, 200);
    assert.ok(response.ok);
    const mimeType = response.headers.get("content-type");
    assert.equal(mimeType.toLowerCase(), "image/jpeg");
  });

  it("returns 404 status code for non-existing url", async () => {
    const response = await fetch(`${SERVER_ORIGIN}/does-not-exist`);
    assert.equal(response.status, 404);
    assert.equal(response.ok, false);
  });
  after(async () => {
    process.kill(-server.pid);
    await closedPromise;
  });
});
