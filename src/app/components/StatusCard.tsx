import type { Character } from "../types";

const stats = [
  { key: "hunger", label: "おなか" },
  { key: "energy", label: "元気" },
  { key: "friendship", label: "なかよし度" },
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
    </section>
  );
}
