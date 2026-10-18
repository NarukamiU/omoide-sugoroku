
import { useEffect, useState } from "react";
import "./App.css";
import { cells } from "./gameData";
import { database, auth } from "./firebase";
import {
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import {
  onValue,
  ref,
  runTransaction,
} from "firebase/database";

type GameState = {
  positions: number[];
  turn: number;
  dice: number | null;
  message: string;
  memoryId: number | null;
  pendingPosition: number | null;
  playerIds: (string | null)[];
  winner: number | null;
};

const initialGame: GameState = {
  positions: [0, 0],
  turn: 0,
  dice: null,
  message: "プレイヤー1からスタート！",
  memoryId: null,
  pendingPosition: null,
  playerIds: [null, null],
  winner: null,
};

function App() {
  const [clientId, setClientId] = useState("");

  const [roomInput, setRoomInput] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomState, setRoomState] = useState<GameState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setClientId(user.uid);
      return;
    }

    signInAnonymously(auth).catch((err) => {
      setError(
        `匿名認証エラー：${
          err instanceof Error ? err.message : "ログインに失敗したで。"
        }`,
      );
    });
  });

  return unsubscribe;
}, []);

  useEffect(() => {
    if (!roomCode || !clientId) return;

    const gameRef = ref(database, `rooms/${roomCode}`);

    const unsubscribe = onValue(
      gameRef,
      (snapshot) => {
        setRoomState(snapshot.exists() ? snapshot.val() : null);
      },
      (err) => {
        setError(`データ取得エラー：${err.message}`);
      },
    );

    return unsubscribe;
  }, [roomCode, clientId]);

  const myPlayer = roomState
    ? roomState.playerIds.indexOf(clientId)
    : -1;

  const memory =
    roomState?.memoryId == null
      ? null
      : cells[roomState.memoryId];

  async function joinRoom() {
    if (!clientId) {
     setError("認証中やで。少し待ってから試してな。");
     return;
    }
    const code = roomInput.trim().toUpperCase();

    if (!/^[A-Z0-9]{4,12}$/.test(code)) {
      setError("ルームIDは半角英数字4〜12文字で入力してな。");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const gameRef = ref(database, `rooms/${code}`);

      const result = await runTransaction(gameRef, (current) => {
        if (current === null) {
          return {
            ...initialGame,
            playerIds: [clientId, null],
          };
        }

        const rawPlayers = current.playerIds ?? {};
        const players: (string | null)[] = [
           rawPlayers[0] ?? null,
           rawPlayers[1] ?? null,
        ];

        if (players.includes(clientId)) {
          return current;
        }

        const emptySeat = players.findIndex((id) => id === null);

        if (emptySeat === -1) {
          return;
        }

        players[emptySeat] = clientId;

        return {
          ...current,
          playerIds: players,
        };
      });

      const joinedState = result.snapshot.val() as GameState | null;

      const joinedPlayers = [
        joinedState?.playerIds?.[0] ?? null,
        joinedState?.playerIds?.[1] ?? null,
      ];

      if (
        !result.committed ||
        !joinedState ||
        !joinedPlayers.includes(clientId)
      ) {
        setError("このルームは満員や。別のルームIDを使ってな。");
        return;
      }

      setRoomCode(code);
    } catch (err) {
      setError(
        err instanceof Error
          ? `接続エラー：${err.message}`
          : "接続に失敗したで。設定を確認してな。",
      );
    } finally {
      setBusy(false);
    }
  }

  async function rollDice() {
    if (
      !roomCode ||
      !roomState ||
      myPlayer !== roomState.turn ||
      roomState.memoryId != null ||
      roomState.winner != null ||
      roomState.positions[roomState.turn] >= cells.length - 1 ||
      busy
    ) {
      return;
    }

    setBusy(true);

    try {
      const gameRef = ref(database, `rooms/${roomCode}`);

      await runTransaction(gameRef, (current) => {
        if (
          !current ||
          current.turn !== myPlayer ||
          current.memoryId != null ||
          current.winner != null ||
          current.positions[current.turn] >= cells.length - 1
        ) {
          return;
        }

        const result = Math.floor(Math.random() * 6) + 1;
        const player = current.turn;

        const landingPosition = Math.min(
          current.positions[player] + result,
          cells.length - 1,
        );

        const landingCell = cells[landingPosition];

        const finalPosition = Math.max(
          0,
          Math.min(
            landingPosition + (landingCell.event ?? 0),
            cells.length - 1,
          ),
        );

        const positions = [...current.positions];
        positions[player] = landingPosition;

        return {
          ...current,
          positions,
          dice: result,
          memoryId: landingPosition,
          pendingPosition: finalPosition,
          message: `プレイヤー${player + 1}は${result}を出して、${landingPosition + 1}番のマスに止まった！`,
        };
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "サイコロを振れなかったで。",
      );
    } finally {
      setBusy(false);
    }
  }

  async function closeMemory() {
    if (!roomCode || !roomState || busy) return;

    setBusy(true);

    try {
      const gameRef = ref(database, `rooms/${roomCode}`);

      await runTransaction(gameRef, (current) => {        
        if (
          !current ||
          current.memoryId == null ||
          current.pendingPosition == null ||
          current.winner != null ||
          current.turn !== myPlayer
        ) {
          return;
        }


        const player = current.turn;
        const finalPosition = current.pendingPosition;
        const landingCell = cells[current.memoryId];
        const positions = [...current.positions];

        positions[player] = finalPosition;

        const winner =
          finalPosition >= cells.length - 1 ? player : null;

        let message =
          landingCell.event !== undefined && landingCell.event !== 0
            ? `イベント発動！ プレイヤー${player + 1}は${finalPosition + 1}番のマスへ移動！`
            : `プレイヤー${player + 1}は${finalPosition + 1}番のマスへ移動！`;

        if (winner !== null) {
          message = `プレイヤー${winner + 1}がゴール！`;
        }

        return {
          ...current,
          positions,
          memoryId: null,
          pendingPosition: null,
          turn: (player + 1) % 2,
          winner,
          message,
        };
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "更新に失敗したで。",
      );
    } finally {
      setBusy(false);
    }
  }

  
  async function restartGame() {
    if (!roomCode || !roomState || busy || roomState.winner == null) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const gameRef = ref(database, `rooms/${roomCode}`);

      await runTransaction(gameRef, (current) => {
        if (!current || current.winner == null) {
          return;
        }

        const rawPlayers = current.playerIds ?? {};
        const players = [
          rawPlayers[0] ?? null,
          rawPlayers[1] ?? null,
        ];

        if (!players.includes(clientId)) {
          return;
        }

        return {
          ...initialGame,
          playerIds: players,
          message: "プレイヤー1からスタート！",
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? `再スタートに失敗：${err.message}`
          : "再スタートに失敗したで。",
      );
    } finally {
      setBusy(false);
    }
  }


  if (!roomCode) {
    return (
      <main className="game">
        <header>
          <p className="eyebrow">OUR MEMORY JOURNEY</p>
          <h1>思い出すごろく</h1>
          <p className="subtitle">二人だけの物語を、もう一度。</p>
        </header>

        <section className="room-panel">
          <h2>二人のルームに参加</h2>
          <p>同じルームIDを二人で入力してな。</p>

          <input
            value={roomInput}
            onChange={(event) => setRoomInput(event.target.value)}
            placeholder="例：LOVE2026"
            maxLength={12}
            autoCapitalize="characters"
          />

          <button onClick={joinRoom} disabled={busy}>
            {busy ? "接続中..." : "ルームを作成・参加"}
          </button>

          {error && <p className="message">{error}</p>}
          <p className="room-note">
            先に参加した人がルームを作成し、もう一人が同じIDで参加するで。
          </p>
        </section>

        <footer>MADE FOR TWO · OUR STORY NEVER ENDS</footer>
      </main>
    );
  }

  if (!roomState) {
    return (
      <main className="game">
        <h1>接続中...</h1>
        {error && <p className="message">{error}</p>}
      </main>
    );
  }

  return (
    <main className="game">
      <header>
        <p className="eyebrow">OUR MEMORY JOURNEY</p>
        <h1>思い出すごろく</h1>
        <p className="subtitle">二人だけの物語を、もう一度。</p>
        <p>ルームID：<strong>{roomCode}</strong></p>
        <p>あなたはプレイヤー{myPlayer + 1}</p>
      </header>

      <section className="status">
        {[0, 1].map((player) => (
          <div
            key={player}
            className={`player ${roomState.turn === player ? "active" : ""}`}
          >
            <span className={`token p${player + 1}`}>
              {player + 1}
            </span>
            <div>
              <strong>
                プレイヤー{player + 1}
                {roomState.playerIds[player] ? "" : "（参加待ち）"}
              </strong>
              <p>{roomState.positions[player] + 1}番のマス</p>
            </div>
          </div>
        ))}
      </section>

      <section className="board">
        {cells.map((cell) => (
          <div
            key={cell.id}
            className={`cell ${
              cell.event
                ? cell.event > 0
                  ? "bonus"
                  : "penalty"
                : ""
            }`}
          >
            <span className="cell-number">{cell.id + 1}</span>

            {cell.id === 0 && <span className="special">START</span>}
            {cell.id === cells.length - 1 && (
              <span className="special">GOAL</span>
            )}

            {cell.event !== undefined && (
              <span className="event">
                {cell.event > 0 ? "+" : ""}
                {cell.event}
              </span>
            )}

            <div className="tokens">
              {roomState.positions.map((position, player) =>
                position === cell.id ? (
                  <span
                    key={player}
                    className={`mini-token p${player + 1}`}
                  >
                    {player + 1}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="control-panel">
        <p className="turn-label">
          NOW PLAYING · プレイヤー{roomState.turn + 1}
        </p>

        {roomState.winner != null && (
          <div className="winner-banner">
            <h2>🎉 ゲーム終了！</h2>
            <p>プレイヤー{roomState.winner + 1}がゴール！</p>
            <button onClick={restartGame} disabled={busy}>
              {busy ? "リセット中..." : "もう一度遊ぶ"}
            </button>
          </div>
        )}

        <div className="dice">{roomState.dice ?? "?"}</div>
        
        <button
          onClick={rollDice}
          disabled={
            busy ||
            (roomState.winner == null &&
              (myPlayer !== roomState.turn ||
                roomState.memoryId != null ||
                roomState.positions[roomState.turn] >= cells.length - 1))
          }
        >
          {roomState.winner != null
          ? "ゲーム終了"
          : myPlayer !== roomState.turn
            ? "相手のターン"
            : busy
              ? "更新中..."
              : "サイコロを振る"}
        </button>

        <p className="message">{roomState.message}</p>
        {error && <p className="message">{error}</p>}
      </section>

      {memory && (
        <div className="modal-backdrop">
          <section className="memory-modal">
            <p className="eyebrow">MEMORY No.{memory.id + 1}</p>
            <h2>{memory.title}</h2>
            <p>{memory.description}</p>

            {memory.imageUrl && (
              <img
                className="memory-image"
                src={memory.imageUrl}
                alt={memory.title}
              />
            )}

            {memory.videoUrl && (
              <video
                className="memory-video"
                src={memory.videoUrl}
                controls
                playsInline
              />
            )}

            {memory.event !== undefined && memory.event !== 0 && (
              <p className="memory-event">
                {memory.event > 0 ? "+" : ""}
                {memory.event}マス移動！
              </p>
            )}

            <button
              onClick={closeMemory}
              disabled={busy || myPlayer !== roomState.turn}
            >
              思い出を閉じて次へ
            </button>
          </section>
        </div>
      )}

      <footer>MADE FOR TWO · OUR STORY NEVER ENDS</footer>
    </main>
  );
}

export default App;
