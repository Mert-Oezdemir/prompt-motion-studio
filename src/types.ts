export type Scene = {
  id: string;
  title: string;
  body: string;
  caption?: string;
  durationSeconds: number;
  accent?: string;
  media?: string;
  audio?: string;
};
export type VideoProject = {
  title: string;
  fps: number;
  scenes: Scene[];
};
