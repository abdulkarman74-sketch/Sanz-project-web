/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const GameView = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const savedScore = localStorage.getItem('sanz_snake_high_score');
    if (savedScore) setHighScore(parseInt(savedScore));
  }, []);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE || prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('sanz_snake_high_score', score.toString());
          }
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - score));
    return () => clearInterval(intervalId);
  }, [direction, isPlaying, gameOver, food, generateFood, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 pb-20 pt-16">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white px-6 py-3 border border-slate-200 rounded-2xl shadow-sm text-center">
            <span className="text-[10px] text-[var(--theme-text-soft)] font-bold uppercase tracking-widest block mb-1">Score</span>
            <span className="text-xl font-display font-black text-slate-800">{score}</span>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-3 rounded-2xl shadow-md text-center border border-yellow-400">
            <span className="text-[10px] text-yellow-100 font-bold uppercase tracking-widest flex items-center gap-1 justify-center mb-1"><Trophy className="w-3 h-3" /> Best</span>
            <span className="text-xl font-display font-black text-[var(--theme-text-main)]">{highScore}</span>
          </div>
        </div>

        <div className="relative aspect-square bg-slate-50 border-2 border-slate-200 rounded-[2rem] p-1 shadow-inner overflow-hidden mb-8">
          <div className="w-full h-full relative" style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
               <div key={i} className="border-[0.5px] border-slate-100" />
            ))}

            {snake.map((segment, i) => (
              <div key={i} className={`${i === 0 ? 'bg-[var(--theme-bg-main)] rounded-sm' : 'bg-[var(--theme-bg-soft)] rounded-sm'}`} style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1, transform: i === 0 ? 'scale(1.1)' : 'scale(0.9)', zIndex: i === 0 ? 10 : 5 }} />
            ))}
            <div className="bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1, transform: 'scale(0.8)' }} />
          </div>

          {!isPlaying && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[2rem] z-20">
              <div className="text-center">
                <h3 className="text-3xl font-display font-black text-slate-800 mb-2 uppercase tracking-tighter">{gameOver ? 'Game Over' : 'Classic Snake'}</h3>
                {gameOver && <p className="text-[var(--theme-text-soft)] font-mono text-sm mb-6">Final Score: {score}</p>}
                <button onClick={resetGame} className="h-14 px-8 bg-[var(--theme-bg-main)] hover:bg-black text-[var(--theme-text-main)] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-3 w-full justify-center">
                  {gameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />} {gameOver ? 'Play Again' : 'Start Game'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 md:hidden max-w-[200px] mx-auto">
          <div />
          <button onClick={() => { if (direction.y === 0) setDirection({ x: 0, y: -1 }); }} className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center active:bg-slate-100 shadow-sm"><div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-slate-800" /></button>
          <div />
          <button onClick={() => { if (direction.x === 0) setDirection({ x: -1, y: 0 }); }} className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center active:bg-slate-100 shadow-sm"><div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] border-t-transparent border-b-transparent border-r-slate-800" /></button>
          <button onClick={() => { if (direction.y === 0) setDirection({ x: 0, y: 1 }); }} className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center active:bg-slate-100 shadow-sm"><div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-slate-800" /></button>
          <button onClick={() => { if (direction.x === 0) setDirection({ x: 1, y: 0 }); }} className="h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center active:bg-slate-100 shadow-sm"><div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-slate-800" /></button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(GameView);
