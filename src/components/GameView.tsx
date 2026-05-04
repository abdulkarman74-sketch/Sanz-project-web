import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Flame, Play } from 'lucide-react';

const GameView = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const GRID_SIZE = 20;
  const INITIAL_SPEED = 150;

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Game loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore.toString());
            }
            return newScore;
          });
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, highScore]);

  const generateFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) break;
    }
    setFood(newFood);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col min-h-screen pt-24 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--theme-text-main)] mb-2 italic">
            SNAKE <span className="text-cyan-400">GAME</span>
          </h2>
          <p className="text-gray-400 font-mono text-xs uppercase tracking-[0.3em]">Classic Arcade Experience</p>
        </div>

        {/* Game Container */}
        <div className="relative p-4 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
          {/* Stats */}
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Score</span>
              <span className="text-xl font-black text-cyan-400">{score}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">High Score</span>
              <span className="text-xl font-black text-blue-400">{highScore}</span>
            </div>
          </div>

          {/* Grid */}
          <div 
            className="relative bg-black/40 rounded-xl overflow-hidden border border-white/5"
            style={{ 
              width: 'min(80vw, 400px)', 
              height: 'min(80vw, 400px)',
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
            }}
          >
            {/* Snake */}
            {snake.map((segment, i) => {
              const isHead = i === 0;
              const isTail = i === snake.length - 1;
              
              // Calculate rotation for head
              let rotation = 0;
              if (isHead) {
                if (direction.x === 1) rotation = 90;
                if (direction.x === -1) rotation = -90;
                if (direction.y === 1) rotation = 180;
                if (direction.y === -1) rotation = 0;
              }

              return (
                <motion.div 
                  key={`${segment.x}-${segment.y}-${i}`}
                  layout
                  initial={false}
                  animate={{ 
                    scale: isHead ? 1.1 : 0.9,
                    borderRadius: isHead ? '40%' : '50%',
                  }}
                  className={`relative flex items-center justify-center ${
                    isHead 
                      ? 'bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20' 
                      : 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.3)]'
                  }`}
                  style={{ 
                    gridColumnStart: segment.x + 1, 
                    gridRowStart: segment.y + 1,
                    transform: isHead ? `rotate(${rotation}deg)` : 'none'
                  }}
                >
                  {isHead && (
                    <div className="absolute inset-0 flex items-start justify-around pt-1">
                      <div className="w-1 h-1 bg-black rounded-full opacity-80" />
                      <div className="w-1 h-1 bg-black rounded-full opacity-80" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Food */}
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 10px rgba(239,68,68,0.5)',
                  '0 0 20px rgba(239,68,68,0.8)',
                  '0 0 10px rgba(239,68,68,0.5)'
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-gradient-to-tr from-red-600 to-orange-400 rounded-full flex items-center justify-center"
              style={{ 
                gridColumnStart: food.x + 1, 
                gridRowStart: food.y + 1 
              }}
            >
              <div className="w-1 h-1 bg-white/40 rounded-full blur-[1px]" />
            </motion.div>

            {/* Overlays */}
            <AnimatePresence>
              {isPaused && !isGameOver && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                >
                  <Play className="w-12 h-12 text-cyan-400 mb-4 animate-pulse" />
                  <h3 className="text-[var(--theme-text-main)] font-bold text-xl mb-4">READY TO PLAY?</h3>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl transition-all uppercase tracking-widest text-sm"
                  >
                    Start Game
                  </button>
                </motion.div>
              )}

              {isGameOver && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <Flame className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-[var(--theme-text-main)] font-black text-3xl mb-2 italic">GAME OVER</h3>
                  <p className="text-gray-400 font-mono text-xs mb-6 uppercase tracking-widest">Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-red-500 hover:bg-red-400 text-[var(--theme-text-main)] font-black rounded-xl transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Controls */}
          <div className="mt-8 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
            <div />
            <button 
              onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })}
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center active:bg-cyan-500/20 active:border-cyan-500/40"
            >
              <ChevronLeft className="w-6 h-6 rotate-90 text-[var(--theme-text-main)]" />
            </button>
            <div />
            <button 
              onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })}
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center active:bg-cyan-500/20 active:border-cyan-500/40"
            >
              <ChevronLeft className="w-6 h-6 text-[var(--theme-text-main)]" />
            </button>
            <button 
              onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })}
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center active:bg-cyan-500/20 active:border-cyan-500/40"
            >
              <ChevronLeft className="w-6 h-6 -rotate-90 text-[var(--theme-text-main)]" />
            </button>
            <button 
              onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })}
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center active:bg-cyan-500/20 active:border-cyan-500/40"
            >
              <ChevronLeft className="w-6 h-6 rotate-180 text-[var(--theme-text-main)]" />
            </button>
          </div>

          {/* Desktop Hint */}
          <div className="hidden md:block mt-6 text-center">
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">Use Arrow Keys to Move</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameView;
