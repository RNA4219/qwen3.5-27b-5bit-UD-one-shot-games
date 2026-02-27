# Qwen3.5-27B UD 5-bit One-shot Canvas Games

From “pon” to games: a one-shot TypeScript canvas game coded by **Qwen3.5 27B UD 5-bit**.  
Qwen3.5 27B UD 5-bit に **一発出し**で書かせた HTML5 Canvas ミニゲームをそのまま動かすデモリポジトリです。

- 🔗 GitHub Pages: https://rna4219.github.io/qwen3.5-27b-5bit-UD-one-shot-games/

---

## What is this?

Qwen3.5 27B UD 5-bit (Unsloth GGUF + llama.cpp) に対して、  
「TypeScript で HTML5 Canvas ゲームを 1 ファイルで実装して」とだけ指示し、

- **Pong**
- **Breakout (ブロック崩し)**
- **Tetris**

の 3 本を **ほぼノータッチで動く形**にしたものです。

フロントのトップページだけは、人間側で React＋CSS を書いて、  
昔のゲームセンターっぽいセレクト画面を載せています。（中身のゲームロジックは LLM そのまま）

---

## Demo

GitHub Pages 版はこちら:

- https://rna4219.github.io/qwen3.5-27b-5bit-UD-one-shot-games/

トップのメニューから各ゲームに遷移できます。

---

## Games

### Pong

- パドル操作:
  - 左プレイヤー: `W` / `S`
  - 右プレイヤー: ↑ / ↓
- ボールは壁とパドルで反射
- どちらかのサイドを抜けるとスコア加算＆センターから再スタート
- 画面左上に `Left: X Right: Y` 形式でスコア表示

### Breakout

- 操作:
  - パドル移動: ← / →
  - ボール発射: Space
- 上部のブロックを壊してスコア加算
- 全ブロック破壊で `YOU WIN`（alert）
- ボール落下でボールのみリセット（スコアは維持）

### Tetris

- 操作（実装に合わせて調整しているはず）:
  - 左右移動: ← / →
  - 回転: ↑
  - ソフトドロップ: ↓
- ラインが揃うと消去＆スコア加算
- 天井まで積み上がるとゲームオーバー

※ テトリスは LLM 出力をそのまま JS 化したものなので、挙動は「レトロ寄り・素朴」くらいの感覚です。





---

## Prompts

各ゲームは、以下のような **単発プロンプト（one-shot）** をそのままモデルに与えて生成しています。  
追加の思考誘導や分割生成は行っていません。

### Pong Prompt

```text
TypeScript で、HTML5 Canvas を使った Pong 風ゲームを実装してください。
制約:
・コードは index.ts 1ファイルにすべてまとめること
・外部ライブラリは使わず、ブラウザの標準APIのみを使うこと
・キャンバスサイズは 800x600
・左プレイヤー: W / Sキーで上下移動
・右プレイヤー: ↑ / ↓キーで上下移動
・ボールは壁とパドルで反射する
・どちらかのサイドを抜けたらスコア加算し、ボールを中央から再スタート
・画面左上に「Left: X Right: Y」とスコアを描画する
・ゲームループには requestAnimationFrame を使うこと

1ファイルで TypeScript のコードだけを出力してください。コメントは必要最低限で構いません。
```
### Breakout Prompt
```text
TypeScript で、HTML5 Canvas を使った ブロック崩し（Breakout）風ゲームを実装してください。
制約:
・コードは index.ts 1ファイルにすべてまとめること
・外部ライブラリは使わず、ブラウザの標準APIのみを使うこと
・キャンバスサイズは 800x600
・パドルは画面下部に配置する
・← / → キーでパドルを左右移動できること
・Spaceキーでボールを発射できること
・ボールは壁・パドル・ブロックで反射すること
・ブロックは複数行・複数列で配置すること
・ブロックを破壊するとスコア加算
・すべてのブロックを破壊したらゲームクリア表示
・ボールが画面下に落ちたらボールを初期位置に戻す
・画面左上にスコアを表示すること
・ゲームループには requestAnimationFrame を使うこと

1ファイルで TypeScript のコードだけを出力してください。コメントは必要最低限で構いません。
```
### Breakout Tetris
```text
TypeScript で、HTML5 Canvas を使った テトリス風落ちものパズルゲームを実装してください。
制約:
・コードは index.ts 1ファイルにすべてまとめること
・外部ライブラリは使わず、ブラウザの標準APIのみを使うこと
・キャンバスサイズは 800x600
・フィールドは横10マス × 縦20マスとする
・テトリミノ（I,O,T,S,Z,J,L の7種類）を実装すること
・ピースはランダムに出現すること
・← / → で左右移動、↑ で回転、↓ でソフトドロップ
・一定間隔で自動落下すること
・ラインが揃ったら消去しスコア加算
・ゲームオーバー条件を実装すること
・画面左上にスコアを表示すること
・ゲームループには requestAnimationFrame を使うこと

1ファイルで TypeScript のコードだけを出力してください。コメントは必要最低限で構いません。
```

---

## Repository structure

```text
.
├─ index.html          # React + CDN で書いたゲーム選択ルート
├─ LICENSE
├─ pong/
│   ├─ index.html
│   └─ index.js       # Qwen3.5 27B UD 5-bit による一発出しコード（TS→JS）
├─ breakout/
│   ├─ index.html
│   └─ index.js
└─ tetris/
    ├─ index.html
    └─ index.js
