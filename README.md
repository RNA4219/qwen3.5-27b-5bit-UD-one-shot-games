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
