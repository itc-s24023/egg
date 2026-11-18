import { useEffect, useRef, type FormEvent } from "react";
import type { Character } from "../types";

type ChatPanelProps = {
  character: Character;
  message: string;
  sending: boolean;
  error: string;
  onMessageChange: (message: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ChatPanel({
  character,
  message,
  sending,
  error,
  onMessageChange,
  onSubmit,
}: ChatPanelProps) {
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (messagesElement) {
      messagesElement.scrollTop = messagesElement.scrollHeight;
    }
  }, [character.messages]);

  return (
    <section className="chat card">
      <h2>おはなし</h2>
      <div className="messages" ref={messagesRef}>
        {character.messages.map((item) => (
          <p className={item.role === "user" ? "user" : "assistant"} key={item.id}>
            {item.content}
          </p>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <input
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="今日の出来事を話してみよう"
        />
        <button disabled={sending}>送る</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
