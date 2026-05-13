export type GameSide = 'girl' | 'boy' | null;

export interface Animal {
  id: string;
  name: string;
  type: string;
  cuteness: number;
  beauty: number;
  size: number;
  image: string;
}

export interface Flower {
  id: string;
  type: string;
  growth: number; // 0 to 100
  image: string;
}

export interface Weapon {
  id: string;
  name: string;
  power: number;
  image: string;
  unlocked: boolean;
}

export interface GameState {
  side: GameSide;
  coins: number;
  purchasedItems: string[];
  animals: Animal[];
  flowers: Flower[];
  weapons: Weapon[];
  destructionScore: number;
}
