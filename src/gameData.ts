// 思い出すごろく：40マス設定データ
// 画像・動画のURLは仮パスです。実ファイルを public/ 配下に配置してください。

export type CellAction =
  | { type: "forward"; value: number }
  | { type: "backward"; value: number }
  | { type: "warp"; target: number } // target は 0 始まり
  | { type: "swap" };

export type CellType = "normal" | "plus" | "minus" | "warp" | "swap" | "goal";
export type MemoryMediaType = "image" | "video" | "none";

export type MemoryCell = {
  id: number;
  title: string;
  description: string;
  cellType: CellType;
  cellImageUrl: string;
  action?: CellAction;
  mediaType: MemoryMediaType;
  imageUrl?: string;
  videoUrl?: string;
  mediaHint?: string;
};

const cellTypeImages: Record<CellType, string> = {
  normal: "/images/cells/cell-normal.png",
  plus: "/images/cells/cell-plus.png",
  minus: "/images/cells/cell-minus.png",
  warp: "/images/cells/cell-warp.png",
  swap: "/images/cells/cell-swap.png",
  goal: "/images/cells/cell-goal.png",
};

const rawCells: Omit<MemoryCell, "cellImageUrl">[] = [
  {
    id: 0,
    title: "精肉店で生焼けの肉を食べさせられる",
    description: "訴える準備はできてるねん",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/01-raw-meat-shop.png",
    mediaHint: "写真さがせ"
  },
  {
    id: 1,
    title: "さやっちの脇を見る（エロ）",
    description: "armpitってエロ動画で検索するとシコい",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/02-sayacchi-armpit-reference.png",
    mediaHint: "画像生成"
  },
  {
    id: 2,
    title: "自転車二人乗りで警察に捕まる",
    description: "「これは僕の自転車です」と一世一代の大ハッタリ",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/03-bicycle-police.png",
    mediaHint: "未指定"
  },
  {
    id: 3,
    title: "そばやとうどんやを間違える",
    description: "裏手にあるなんて気づかんやん。親子丼多すぎ",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/04-soba-oyakodon.png",
    mediaHint: "そばと親子丼"
  },
  {
    id: 4,
    title: "北海道を30km歩いた後、全力で腿上げをする",
    description: "さすがに笑いすぎて払いたかった。ソファみたいなしろくまがセット。",
    cellType: "plus",
    mediaType: "image",
    action: { type: "forward", value: 2 },
    imageUrl: "public/memories/05-hokkaido-walking-wolf.png",
    mediaHint: "動物園の狼"
  },
  {
    id: 5,
    title: "フル装備でチェキを撮る",
    description: "周りの実行委員女子どう思ってたんやろ",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/06-full-gear-cheki.png",
    mediaHint: "あのチェキ"
  },
  {
    id: 6,
    title: "志人の体から発する熱を直に感じる",
    description: "彼は物理的に熱い",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/07-shibito-expo.png",
    mediaHint: "記念写真万博"
  },
  {
    id: 7,
    title: "立入禁止エリアの馬に近づく",
    description: "ドラ息子さんよぉ",
    cellType: "minus",
    mediaType: "image",
    action: { type: "backward", value: 2 },
    imageUrl: "public/memories/08-horse-no-entry.png",
    mediaHint: "ドラ息子"
  },
  {
    id: 8,
    title: "筆箱に放置していた消しカス味のチョコエッグを食べる",
    description: "友達関係の転換点",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/09-eraser-choco-egg.png",
    mediaHint: "お風呂とベッドの上"
  },
  {
    id: 9,
    title: "チェンバーのウルトを3時間以上射撃訓練場で撃ち続ける",
    description: "マイクラで無限に釣りしてたのも怖い",
    cellType: "normal",
    mediaType: "video",
    action: undefined,
    videoUrl: "public/memories/10-chamber-practice.mp4",
    mediaHint: "チェンバー"
  },
  {
    id: 10,
    title: "播磨町の急な下り坂を自転車二人乗りで駆け下り、後部座席の人間が荷物置きに股間を強打する",
    description: "どっちがか毎回必ず犠牲になる",
    cellType: "plus",
    mediaType: "image",
    action: { type: "forward", value: 3 },
    imageUrl: "public/memories/11-harima-steep-slope.png",
    mediaHint: "坂の画像。Googleマップ"
  },
  {
    id: 11,
    title: "ロボ研で9時〜9時で働いて体を壊す",
    description: "釜揚げ週7で食べて腹下した",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/12-robotics-lab-overtime.png",
    mediaHint: "ロボ研の画像"
  },
  {
    id: 12,
    title: "タージ・マハル エベレスト茨木店にて、ネパールの挨拶をするも店員に無視される",
    description: "外国人は愛想あれよ!",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/13-taj-mahal-everest-kulfi.png",
    mediaHint: "クルフィの画像"
  },
  {
    id: 13,
    title: "PCが壊れて、DELLのノートパソコンでAPEXをプレイする羽目になる",
    description: "酢酸かのん時代",
    cellType: "warp",
    mediaType: "image",
    action: { type: "warp", target: 20 },
    imageUrl: "public/memories/14-dell-apex-low-quality.png",
    mediaHint: "APEX画質悪い感じ"
  },
  {
    id: 14,
    title: "興味のない数学の話を延々と聞かされる",
    description: "単純に不快",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/15-math-lecture.png",
    mediaHint: "いかそん"
  },
  {
    id: 15,
    title: "さやっちが、ボゴソーターの悪口を言っているのを聞いてしまう",
    description: "あいつハゲなのに、注意してくるなや",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/16-sayacchi-bogosota.png",
    mediaHint: "さやっち"
  },
  {
    id: 16,
    title: "ほっぺたがデカすぎる東さんの夢を見る",
    description: "夢すぎるやろ!",
    cellType: "minus",
    mediaType: "image",
    action: { type: "backward", value: 3 },
    imageUrl: "public/memories/17-azuma-closeup.png",
    mediaHint: "東さんドアップ"
  },
  {
    id: 17,
    title: "フランス文学好き同級生の乳輪の色を知ってしまう",
    description: "亀甲縛りクラブってなんやねん",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/18-tamadahana.png",
    mediaHint: "卒業アルバム案（使用は要確認）"
  },
  {
    id: 18,
    title: "文化祭で馬車馬のように働かされる",
    description: "土井くんがんばって!!",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/19-festival-low-chair.png",
    mediaHint: "どいくんの低い椅子の画像"
  },
  {
    id: 19,
    title: "「云/鬼 呼 生 –たま よび いく–」を部室でループ再生して、完全に敬遠される",
    description: "志人にたどり着くのが遅れた理由3選",
    cellType: "swap",
    mediaType: "video",
    action: { type: "swap" },
    videoUrl: "public/memories/20-tama-yobi-iku-loop.mp4",
    mediaHint: "たまよびいく再生"
  },
  {
    id: 20,
    title: "受験に落ち続けた紳士の悲痛な面持ちを目にする",
    description: "舐めてんのか?!彼はときに佐山聡となるのだ。",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/21-library-sad-gentleman.png",
    mediaHint: "図書館の前のあいつの顔"
  },
  {
    id: 21,
    title: "二人前の定食を頼み、女将に突っ込まれる",
    description: "もう一人来るの?",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/22-awaji-double-meal.png",
    mediaHint: "淡路島定食や"
  },
  {
    id: 22,
    title: "肌着で授業を受ける",
    description: "肌着も影も薄すぎて気づかれない",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/23-undershirt-class.png",
    mediaHint: "カツの情報質の肌着の画像"
  },
  {
    id: 23,
    title: "公然わいせつ罪で逮捕される",
    description: "スプラトゥーンにそんな人は居ません。",
    cellType: "plus",
    mediaType: "image",
    action: { type: "forward", value: 2 },
    imageUrl: "public/memories/24-kamagake-udon.png",
    mediaHint: "丸亀製麺釜揚げの画像"
  },
  {
    id: 24,
    title: "ヘルメットで頭を殴られて脳震盪を起こす",
    description: "流石にガチギレ、1年生に怖がられる",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/25-helmet-kohei.png",
    mediaHint: "航平の写真"
  },
  {
    id: 25,
    title: "カーディガンガーディアンとして屯田兵に任命される",
    description: "ここの塔の思い出まじでカレーだけ。",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/26-cardigan-guardian.png",
    mediaHint: "あの写真"
  },
  {
    id: 26,
    title: "志人に傾倒する",
    description: "ほぼ発酵しっちゃってるよね。",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/27-shibito-monochrome.png",
    mediaHint: "モノクロ記念写真"
  },
  {
    id: 27,
    title: "ミサイルを迎撃するシステムを作る",
    description: "東京の地下鉄の空気の熱交換モデルも作る",
    cellType: "minus",
    mediaType: "image",
    action: { type: "backward", value: 2 },
    imageUrl: "public/memories/28-missile-interceptor-project.png",
    mediaHint: "あの先生の写真"
  },
  {
    id: 28,
    title: "お菓子系かと思ったらおかず系のはんぺんでした。",
    description: "俺だけお菓子系のやつで美味かったっていう。",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/29-hanpen-surprise.png",
    mediaHint: "北海道グッドマークカツ"
  },
  {
    id: 29,
    title: "ピノキオに立ちバックされる",
    description: "ポルチオやられてるよね。",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/30-pinocchio-usj.png",
    mediaHint: "ピノキオ USJ"
  },
  {
    id: 30,
    title: "うぽぽいの栞をありえない値段で買って損をする",
    description: "ちょっとかっこいいのやめろ",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/31-upopoy-bookmark.png",
    mediaHint: "うぽぽいの栞"
  },
  {
    id: 31,
    title: "人を好きになる、だが見えない意志による幻影だと気づく。だが、それでも、と思いもがく。",
    description: "僕が女の子だったら、志人に嫁入りしてたよ。",
    cellType: "warp",
    mediaType: "image",
    action: { type: "warp", target: 28 },
    imageUrl: "public/memories/32-love-and-illusion.png",
    mediaHint: "好きな人の写真"
  },
  {
    id: 32,
    title: "人文学の教授をめぐる衝撃的な噂",
    description: "みゆき→綺麗な顔、お腹引き締まっている、くびれのある体型、エロくてテクニックある、乳首が綺麗、美乳、会話楽しい、明石高専の荒◯裕◯教授と相思相愛で結婚予定、どこの店でも人気No.1嬢",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/33-humanities-professor-rumor-reference.png",
    mediaHint: "荒川の写真（使用可否を要確認）"
  },
  {
    id: 33,
    title: "著しく社会的信用を失う",
    description: "やだやだやだやだ!!!",
    cellType: "normal",
    mediaType: "video",
    action: undefined,
    videoUrl: "public/memories/34-social-credit-valorant.mp4",
    mediaHint: "valorant動画"
  },
  {
    id: 34,
    title: "初期装備のまま学校に出撃する",
    description: "髪から出てる顔の表面だけ見たらひょうたんみたいなシルエットしてるな",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/35-starter-gear-school.png",
    mediaHint: "黒川さん"
  },
  {
    id: 35,
    title: "いつの間にか儀式を行っていて、宝箱を召喚してしまう",
    description: "どぉん",
    cellType: "plus",
    mediaType: "video",
    action: { type: "forward", value: 3 },
    videoUrl: "public/memories/36-realm-royale-chest.mp4",
    mediaHint: "realm royal"
  },
  {
    id: 36,
    title: "教室だと思ったら、でっかいアナルでした。チクショー!",
    description: "さすがに什器まではなかったと思う。",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/37-classroom-surreal-joke.png",
    mediaHint: "大坪さん"
  },
  {
    id: 37,
    title: "片足のすね毛だけ消失する。",
    description: "みなみかわ っていう名字からおもろい",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/38-one-leg-hair.png",
    mediaHint: "みなみかわ"
  },
  {
    id: 38,
    title: "ナダルに得体のしれない大学に勧誘される",
    description: "金子くん連行",
    cellType: "normal",
    mediaType: "image",
    action: undefined,
    imageUrl: "public/memories/39-nadal-university-pitch.png",
    mediaHint: "金子はると井上"
  },
  {
    id: 39,
    title: "今日も遊べるという幸せがここにあります。",
    description: "これからもエピソードトークを作っていきましょう",
    cellType: "goal",
    mediaType: "image",
    action: undefined,
    mediaHint: "荒川の写真"
  },
];

export const cells: MemoryCell[] = rawCells.map((cell) => ({
  ...cell,
  cellImageUrl: cellTypeImages[cell.cellType],
}));
