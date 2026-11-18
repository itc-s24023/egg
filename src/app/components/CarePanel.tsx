const actions = [
  { id: "feed", label: "ごはん", icon: "🍙" },
  { id: "play", label: "遊ぶ", icon: "🎮" },
  { id: "sleep", label: "寝かせる", icon: "💤" },
] as const;

type CarePanelProps = {
  canFeed: boolean;
  canPlay: boolean;
  canSleep: boolean;
  sleepsToday: number;
  onCare: (action: (typeof actions)[number]["id"]) => void;
};

export default function CarePanel({ canFeed, canPlay, canSleep, sleepsToday, onCare }: CarePanelProps) {
  return (
    <section className="care card">
      <h2>お世話する</h2>
      {!canFeed && <p className="hint">ごはんをあげるには、AIと1回会話してください。</p>}
      {!canPlay && <p className="hint">遊ぶには、じゃんけんかミニゲームを1回プレイしてください。</p>}
      <p className="hint">寝かせる：本日 {sleepsToday}/2回</p>
      <div className="actions">
        {actions.map((action) => (
          <button
            key={action.id}
            disabled={
              (action.id === "feed" && !canFeed)
              || (action.id === "play" && !canPlay)
              || (action.id === "sleep" && !canSleep)
            }
            onClick={() => onCare(action.id)}
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
