import type { Character } from "../types";

export default function CharacterSummary({ character }: { character: Character }) {
  const face = character.growthStage === "たまご" ? "🥚" : character.growthStage === "こども" ? "🐣" : "🐥";

  return (
    <section className="pet card">
      <div className="pet-face">{face}</div>
      <div>
        <span className="badge">{character.growthStage}</span>
        <h2>こんにちは！</h2>
        <p>経験値 {character.experience} / 300</p>
      </div>
    </section>
  );
}
