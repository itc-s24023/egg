import type { Character } from "../types";

const stats = [
  { key: "hunger", label: "おなか" },
  { key: "energy", label: "元気" },
  { key: "friendship", label: "なかよし度" },
] as const;

const personalityStats = [
  { key: "brightness", label: "明るさ", color: "#f4a261" },
  { key: "logic", label: "論理", color: "#5b8def" },
  { key: "humor", label: "ユーモア", color: "#d67bea" },
  { key: "politeness", label: "丁寧さ", color: "#62b69a" },
] as const;

export default function StatusCard({ character }: { character: Character }) {
  return (
    <section className="stats card">
      {stats.map(({ key, label }) => {
        const value = character.status[key];
        return (
          <div key={key}>
            <span>{label}</span>
            <strong>{value}%</strong>
            <progress max="100" value={value} />
          </div>
        );
      })}
      <div className="personality-stats">
        <h2>性格パラメーター</h2>
        <p className="hint">会話の内容に応じて変化します</p>
        {personalityStats.map(({ key, label, color }) => {
          const value = character.status[key];
          return (
            <div className="personality-stat" key={key}>
              <span>{label}</span>
              <strong>{value}</strong>
              <progress max="100" value={value} style={{ accentColor: color }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
