const actions = [
  { id: "feed", label: "ごはん", icon: "🍙" },
  { id: "play", label: "遊ぶ", icon: "🎮" },
  { id: "sleep", label: "寝かせる", icon: "💤" },
] as const;

type CarePanelProps = {
  onCare: (action: (typeof actions)[number]["id"]) => void;
};

export default function CarePanel({ onCare }: CarePanelProps) {
  return (
    <section className="care card">
      <h2>お世話する</h2>
      <div className="actions">
        {actions.map((action) => (
          <button key={action.id} onClick={() => onCare(action.id)}>
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
