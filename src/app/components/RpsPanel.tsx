const choices = [
  ["rock", "グー"],
  ["paper", "パー"],
  ["scissors", "チョキ"],
] as const;

type RpsPanelProps = {
  result: string;
  onPlay: (choice: (typeof choices)[number][0]) => void;
};

export default function RpsPanel({ result, onPlay }: RpsPanelProps) {
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
      {result && <p>{result}</p>}
    </section>
  );
}
