import type { Analysis } from "../types";

type SettingsPanelProps = {
  analysis: Analysis | null;
  onAnalyze: () => void;
  onReset: () => void;
};

export default function SettingsPanel({ analysis, onAnalyze, onReset }: SettingsPanelProps) {
  return (
    <section className="settings card">
      <h2>キャラクター分析・設定</h2>
      <div className="actions">
        <button className="secondary" onClick={onAnalyze}>
          性格・話題を分析
        </button>
        <button className="secondary" onClick={onReset}>
          育成をやり直す
        </button>
      </div>
      {analysis && (
        <p>
          性格タイプ: <strong>{analysis.personalityType}</strong>
          <br />
          話題:{" "}
          {analysis.topics.length
            ? analysis.topics.map((topic) => `${topic.topic} (${topic.count})`).join("、")
            : "まだ十分な会話がありません"}
        </p>
      )}
      <p className="terms">会話内容はキャラクター育成と分析のために保存されます。</p>
    </section>
  );
}
