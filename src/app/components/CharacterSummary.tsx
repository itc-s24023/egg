import type { Character } from "../types";
import { getCharacterImage } from "@/src/lib/character-image";

export default function CharacterSummary({ character }: { character: Character }) {
  const image = getCharacterImage(
    character.name,
    character.growthStage,
    character.status,
    character.personalityType,
  );

  return (
    <section className="pet card">
      <img
        className="pet-face"
        src={image.src}
        alt={`${character.name}の${character.growthStage}の姿`}
      />
      <div>
        <span className="badge">{character.growthStage}</span>
        <h2>こんにちは！</h2>
        <p>経験値 {character.experience} / 300</p>
      </div>
    </section>
  );
}
