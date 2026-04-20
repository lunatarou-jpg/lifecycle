# エージェント・オーケストレーション管理ガイド

## 新しい人格（エージェント）の追加方法

1. **新しい設定 JSON の作成**:
   `.gemini/agents/` 以下に新しい人格の名前で JSON を作成します。
   （例: `ui-designer.json`）

2. **専用の Markdown 指示書の作成**:
   `.gemini/instructions/` 以下に、JSON から参照される詳細なルールを記述した Markdown ファイルを作成します。
   （例: `ui-designer.md`）

3. **人格の切り替え**:
   `.gemini/config.json` の `activeAgent` フィールドを書き換えます。

## 人格の切り替えと動作報告
起動時に、現在どの `activeAgent` が選ばれ、どのパラメータで動作しているかを、エージェントは必ずユーザーに報告します。
報告の際は以下の形式に従います：
> **[Persona: Senior-Engineer]**
> 「シニアエンジニアとして、厳格な型チェックとテスト駆動開発を維持しながら作業を開始します。」
