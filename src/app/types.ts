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
  };
  messages: Message[];
};

export type AppState = {
  character: Character;
};

export type Analysis = {
  personalityType: string;
  topics: Array<{ topic: string; count: number }>;
};
