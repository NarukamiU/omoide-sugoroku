
export type MemoryCell = {
  id: number;
  title: string;
  description: string;
  event?: number;
  imageUrl?: string;
  videoUrl?: string;
};

export const cells: MemoryCell[] = Array.from(
  { length: 30 },
  (_, id) => ({
    id,
    title: `${id + 1}番のマス`,
    description: "ここに二人の思い出を設定しよう。",
  }),
);

// 思い出・イベントのサンプル
cells[4] = {
  id: 4,
  title: "あの日の思い出",
  description: "ここに二人の思い出を書こう！",
  event: 3,
  imageUrl: "/memories/first-game.jpg",
};

cells[9] = {
  id: 9,
  title: "まさかの後退！",
  description: "あのときの失敗、覚えてる？",
  event: -3,
  imageUrl: "/memories/first-game.png",
};

cells[15] = {
  id: 15,
  title: "ボーナスマス",
  description: "楽しかった思い出でもうひと盛り上がり！",
  event: 2,
  videoUrl: "/memories/old-video.mp4",
};

cells[21] = {
  id: 21,
  title: "寄り道マス",
  description: "ちょっと昔に戻ってみよう。",
  event: -2,
};

cells[25] = {
  id: 25,
  title: "動画の思い出",
  description: "あの頃の映像を見てみよう。",
  videoUrl: "/memories/old-video.mp4",
};
