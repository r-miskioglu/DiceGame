export interface Move {
  amount: number;
  number: number;
}

export interface Player {
  id: string;
  name: string;
  lives: number;
  dice: number[];
  moves: Move[];
}

export interface Lobby {
  start: boolean;
  id: string;
  admin_id: string;
  players: Player[];
  local_id: string;
}

export interface GameState {
  id: string;
  state: number;
  players: Player[];
  local_id: string;
}

export interface colors {
  text: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
}
