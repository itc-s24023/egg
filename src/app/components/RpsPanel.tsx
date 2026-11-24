const choices = [
  ["rock", "グー"],
  ["paper", "パー"],
  ["scissors", "チョキ"],
] as const;

type RpsPanelProps = {
  result: string;
  resultType: "win" | "lose" | "draw" | null;
  onPlay: (choice: (typeof choices)[number][0]) => void;
};

export default function RpsPanel({ result, resultType, onPlay }: RpsPanelProps) {
  return (
    <section className="care card">
      <h2>じゃんけん</h2>
      <div className="actions">
        {choices.map(([value, label]) => (
          <button key={value} onClick={() => onPlay(value)}>
            {label}
          </button>
        ))}
      </div>
      {result && (
        <div className={`game-result ${resultType === "win" ? "game-result-win" : resultType === "lose" ? "game-result-lose" : "game-result-draw"}`} role="status" aria-live="polite">
          {resultType === "win" && (
            <div className="confetti" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, index) => <span key={index} />)}
            </div>
          )}
          <strong>{resultType === "win" ? "🎉 おめでとう！ 🎉" : resultType === "lose" ? "🤝 よく頑張ったね！" : "引き分け！"}</strong>
          <p>{result}</p>
        </div>
      )}
    </section>
  );
}
