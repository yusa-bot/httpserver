import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 環境変数 PORT が設定されていればそれを使用、なければ 12345
// parseInt(文字列, 基数)　　　　　　//ある　　　　　　　　　　　　　　　//ない
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 12345;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /public 内のファイルを取得
// __dirnameは現在のファイルがあるフォルダのパス(server.ts のあるディレクトリ)

// req.url を /public 内のパスとして結合
// PUBLIC_DIR は 「ここにファイルがあるよ！」 という基準点
const PUBLIC_DIR = path.join(__dirname, "../public");
console.log("PUBLIC_DIR:", PUBLIC_DIR);

// MIMEタイプのマッピング
// 適切な Content-Type を設定

// 未知の拡張子はapplication/octet-stream
  // octet-stream →「バイナリデータの流れ（ストリーム）」 を意味
    // つまり、「このデータは特定のフォーマットがわからないバイナリデータ」

// 任意のキー（string 型）を持つオブジェクトで、その値は string 型になる
  // キー（ ".html", ".jpg") : 値（"text/html", "image/jpeg"）
// {} → オブジェクトの型
const mimeTypes: { [key: string]: string } = {
  ".html": "text/html",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

// HTTP サーバーの作成
// (req, res) :「リクエスト」と「レスポンス」のオブジェクト. コールバック関数の引数
  // req:req.url, req.method(GET, POST）
  // res:HTTPステータスコード,ヘッダー, データ, end(終了)
const server = http.createServer((req, res) => {
  if (!req.url) {
    // writeHead()はHTTPレスポンスのステータスコードとヘッダーを設定するための関数
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("400 Bad Request");
    return;
  }

  // リクエストされた URL を元にファイルパスを決定
  let filePath = req.url === "/" ? path.join(PUBLIC_DIR, "index.html") : path.join(PUBLIC_DIR, req.url);


  // ディレクトリトラバーサル対策（/public 以外のアクセスを防ぐ）
  // path.join() は .. を含むパスも解釈してしまう
  // filePath が /public の中にあるか確認することで /etc/passwd などのアクセスを防ぐ

  // startsWith() は、文字列が特定の文字列で始まっているかをチェックするメソッド
    // filePathオブジェクトのメソッド
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  // ファイルの拡張子を取得し、MIME タイプを決定
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  // ファイルを読み込んでレスポンスを返す
  // コールバック関数
  console.log("読み込もうとしたファイル:", filePath); 
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("ファイル読み込みエラー:", err);
      if (err.code === "ENOENT") {
        // ファイルが見つからない場合（404）
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        // その他のエラー（500）
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error");
      }
      return;
    }

    // 正常にファイルを読み込めた場合
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

// サーバーを起動
// サーバーがリクエストを受け付けられる状態にする
// ポート番号を指定して、そのポートでリクエストを待機する
// リスニング開始後に実行されるコールバック関数を渡せる
server.listen(PORT, () => {
  // サーバーが起動した後に実行
  console.log(`Server running at http://localhost:${PORT}/`);
});
