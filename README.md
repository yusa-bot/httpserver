# http_server
TSで静的サーバーを作成。
リクエストにURLとしてわたってきたパスに対応するファイルを/public から探して読み込み、その中身をレスポンスとして返す。
例： http://localhost:12345/hello.html にアクセスがあったら、 /public/hello.html を返す。

### ステータスコード
ファイルが存在する場合は200、存在しない場合は404、その他のエラーは500を設定する。
### レスポンスヘッダー
Content-Typeというヘッダーにtext/html等をつけて返す。
*.html : text/html
*.jpg : image/jpeg
*.json : text/json
*.ico : image/x-icon
### 環境変数
PORTに値があるときはサーバーのポートは設定された値で待ち受ける。
値が設定されていないときは 12345 で待ち受ける。

## ファイル構成
```bash
http_server/
├── node_modules #Node.jsモジュール
├── package.json #Node.js設定
├── tscongig.json #TS設定
├── public/ #静的ファイル(今回は、表示対象のファイル達)
    └── favicon.ico
    └── hello.html
    └── index.html
    └── sample.json
    └── wanko.jpg
└── src/ #プロジェクトのメインフォルダ。主にこのフォルダに実装。
    └── server.ts #サーバー実装
    └── server.test.ts #server.tsテスト用
    └── memo.ts #学習用個人メモ
```
