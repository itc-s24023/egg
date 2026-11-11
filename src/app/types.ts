export type Message = {
  id: string;
  role: string;
  content: string;
};

export type Character = {
  name: string;
  growthStage: string;
  experience: number;
  status: {
    hunger: number;
    energy: number;
    friendship: number;
    brightness: number;
    logic: number;
    humor: number;
    politeness: number;
  };
  messages: Message[];
};

export type AppState = {
  character: Character;
  canFeed: boolean;
  canPlay: boolean;
  canSleep: boolean;
  sleepsToday: number;
};

export type Analysis = {
  personalityType: string;
  topics: Array<{ topic: string; count: number }>;
};
