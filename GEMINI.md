# Project: Weather-Wear (Commute-Aware Weather Assistant)

## エージェント起動プロトコル (ブートローダー)
1. **人格の初期化 (Persona Initialization)**:
   - 起動直後に必ず `.gemini/config.json` を読み、`activeAgent` を特定してください。
   - 特定したエージェントの JSON ファイル（例: `.gemini/agents/senior-engineer.json`）と、そこから参照される Markdown 指示書をすべて読み込み、指定された人格として振る舞いを固定してください。
   - ユーザーに対し、現在どの人格で動作しているかを報告してください。

2. **コンテキストの復元 (Context Restoration)**:
   - `docs/history/` を確認し、最新のログファイルを読み込んで「前回の作業内容」と「残タスク」を把握してください。
   - `docs/tasks/roadmap.yaml` を読み込み、プロジェクトの全体像と直近の TODO を同期してください。

3. **記録の維持 (Logging & Roadmap)**:
   - 毎回の作業完了後、`docs/history/` のログを更新し、必要に応じて `docs/tasks/roadmap.yaml` のステータスを更新してください。

## 優先ルール
- すべての技術的判断は `.gemini/instructions/` 以下の各人格用指示書に従ってください。
- コミットメッセージと言語応答は常に「日本語」で行ってください。
