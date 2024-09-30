import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/cloudflare";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "Ematchi Game" },
    { name: "description", content: "Play the Ematchi game with emojis!" },
  ];
};

const emojis = ["😀", "😎", "🥳", "🤔", "😍", "🤯", "🥶", "🤠"];

type GameState = "start" | "playing" | "end";

export default function Ematchi() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [gameState, setGameState] = useState<GameState>("start");

  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameState("end");
    }
  }, [matched, cards]);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled.map(card => card.emoji));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setTime(0);
    setGameState("playing");
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setScore((prevScore) => prevScore + 10);
      } else {
        setScore((prevScore) => Math.max(0, prevScore - 1));
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 text-white">
      <h1 className="text-5xl font-bold mb-8 text-yellow-300 shadow-lg">Ematchi Game</h1>
      {gameState === "start" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="px-6 py-3 bg-green-500 rounded-full text-xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
          onClick={initializeGame}
        >
          Start Game
        </motion.button>
      )}
      {gameState === "playing" && (
        <>
          <div className="mb-4 text-xl">
            Score: {score} | Time: {time}s
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-4"
          >
            {cards.map((emoji, index) => (
              <motion.button
                key={index}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: flipped.includes(index) || matched.includes(index) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`w-20 h-20 text-4xl flex items-center justify-center rounded-lg shadow-lg ${
                  flipped.includes(index) || matched.includes(index)
                    ? "bg-white text-black"
                    : "bg-blue-500"
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div className="absolute backface-hidden">
                  {flipped.includes(index) || matched.includes(index) ? emoji : "?"}
                </div>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
      {gameState === "end" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-4">Final Score: {score}</p>
          <p className="text-xl mb-8">Time: {time}s</p>
          <button
            className="px-6 py-3 bg-green-500 rounded-full text-xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
            onClick={initializeGame}
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}