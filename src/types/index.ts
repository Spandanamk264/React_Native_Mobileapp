export interface Session {
  id: string;
  timestamp: string; // ISO string date
  durationInSeconds: number; // Time taken for 10 kicks
  kickCount: number; // Should be 10, but storing it just in case logic changes
}

export type RootStackParamList = {
  Home: undefined;
  Counter: undefined;
};
