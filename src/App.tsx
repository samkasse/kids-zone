import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Heart, Zap, ShoppingCart, Star, Trophy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GirlSide } from './components/GirlSide';
import { BoySide } from './components/BoySide';
import { Shop } from './components/Shop';
import { PopUpManager } from './components/PopUpManager';
import { GameState, GameSide, Animal, Flower, Weapon } from './types';
import { INITIAL_WEAPONS, CURRENCY_NAME } from './constants';
import confetti from 'canvas-confetti';

export default function App() {
  const [state, setState] = useState<GameState>({
    side: null,
    coins: 100,
    purchasedItems: [],
    animals: [],
    flowers: [],
    weapons: INITIAL_WEAPONS,
    destructionScore: 0,
  });

  const [isShopOpen, setIsShopOpen] = useState(false);

  // Passive income simulation
  useEffect(() => {
    if (!state.side) return;
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, coins: prev.coins + 1 }));
    }, 5000);
    return () => clearInterval(interval);
  }, [state.side]);

  const handleSideSelect = (side: GameSide) => {
    setState(prev => ({ ...prev, side }));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleBuyItem = (item: any) => {
    if (state.coins < item.price) return;

    setState(prev => {
      const newState = { ...prev, coins: prev.coins - item.price };
      
      if (item.type === 'animal') {
        const newAnimal: Animal = {
          id: Date.now().toString(),
          name: item.name,
          type: item.id,
          cuteness: 50,
          beauty: 50,
          size: 10,
          image: item.image
        };
        newState.animals = [...prev.animals, newAnimal];
      } else if (item.type === 'flower') {
        const newFlower: Flower = {
          id: Date.now().toString(),
          type: item.name,
          growth: 0,
          image: item.image
        };
        newState.flowers = [...prev.flowers, newFlower];
      } else if (item.type === 'weapon') {
        newState.weapons = prev.weapons.map(w => ({ ...w, unlocked: false })); // Lock others for simplicity
        newState.weapons.push({
          id: item.id,
          name: item.name,
          power: prev.weapons.length + 1,
          image: item.image,
          unlocked: true
        });
      }

      return newState;
    });

    confetti({
      particleCount: 50,
      spread: 30,
      origin: { y: 0.8 }
    });
  };

  const handleGirlAction = (type: 'pet' | 'water' | 'contest', id: string) => {
    setState(prev => {
      if (type === 'water') {
        return {
          ...prev,
          flowers: prev.flowers.map(f => f.id === id ? { ...f, growth: Math.min(100, f.growth + 10) } : f),
          coins: prev.coins + 5
        };
      }
      if (type === 'pet') {
        return {
          ...prev,
          animals: prev.animals.map(a => a.id === id ? { ...a, cuteness: Math.min(100, a.cuteness + 5) } : a),
          coins: prev.coins + 2
        };
      }
      if (type === 'contest') {
        return { ...prev, coins: prev.coins + 50 };
      }
      return prev;
    });
  };

  const handleBoyAction = (type: 'shoot' | 'upgrade', id: string) => {
    setState(prev => {
      if (type === 'shoot') {
        return {
          ...prev,
          destructionScore: prev.destructionScore + 10,
          coins: prev.coins + 5
        };
      }
      return prev;
    });
  };

  const handleIAP = (price: number, itemId: string) => {
    // Simulate real purchase
    setState(prev => ({
      ...prev,
      coins: prev.coins + 1000, // Give them a lot of coins for "buying"
      purchasedItems: [...prev.purchasedItems, itemId]
    }));
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF4500']
    });
  };

  if (!state.side) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-4xl w-full"
        >
          <h1 className="text-6xl font-black mb-4 tracking-tighter text-slate-900">CHOOSE YOUR ADVENTURE!</h1>
          <p className="text-xl text-slate-500 font-bold mb-12 uppercase tracking-widest">Two worlds. One epic game.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSideSelect('girl')}
              className="group cursor-pointer bg-pink-50 p-12 rounded-[3rem] border-8 border-pink-100 hover:border-pink-300 transition-all shadow-xl"
            >
              <div className="w-32 h-32 bg-pink-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                <Heart className="text-white w-16 h-16 fill-current" />
              </div>
              <h2 className="text-4xl font-black text-pink-600 mb-2">CARE & BLOOM</h2>
              <p className="text-pink-400 font-bold">Grow flowers, help cute animals, and shine in beauty contests!</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSideSelect('boy')}
              className="group cursor-pointer bg-slate-900 p-12 rounded-[3rem] border-8 border-slate-800 hover:border-yellow-400 transition-all shadow-xl"
            >
              <div className="w-32 h-32 bg-yellow-400 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:-rotate-12 transition-transform">
                <Zap className="text-slate-900 w-16 h-16 fill-current" />
              </div>
              <h2 className="text-4xl font-black text-yellow-400 mb-2">ACTION & BLAST</h2>
              <p className="text-slate-400 font-bold">Destroy targets, upgrade huge weapons, and rule the battle zone!</p>
            </motion.div>
          </div>
        </motion.div>
        
        <footer className="mt-12 text-[10px] text-slate-400 font-medium opacity-50">
          Copyright © 2026 Sam Agaba. All Rights Reserved. Protected under the Copyright and Neighbouring Rights Act, 2006 (Uganda).
        </footer>
      </div>
    );
  }

  return (
    <div className="relative">
      <PopUpManager side={state.side} onBuy={handleIAP} />
      
      {state.side === 'girl' ? (
        <GirlSide 
          animals={state.animals} 
          flowers={state.flowers} 
          onAction={handleGirlAction} 
        />
      ) : (
        <BoySide 
          weapons={state.weapons} 
          destructionScore={state.destructionScore} 
          onAction={handleBoyAction} 
        />
      )}

      {/* Global HUD */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4">
        <div className={`px-8 py-4 rounded-full flex items-center gap-4 border-4 shadow-2xl backdrop-blur-md ${
          state.side === 'girl' ? 'bg-white/90 border-pink-200 text-pink-600' : 'bg-slate-900/90 border-slate-700 text-yellow-400'
        }`}>
          <Star className="fill-current" />
          <span className="text-3xl font-black">{state.coins}</span>
          <span className="text-xs font-bold uppercase">{CURRENCY_NAME}</span>
        </div>

        <Button 
          onClick={() => setIsShopOpen(true)}
          className={`h-16 w-16 rounded-full shadow-2xl border-4 transition-transform hover:scale-110 ${
            state.side === 'girl' ? 'bg-pink-500 border-pink-300' : 'bg-yellow-400 border-yellow-200 text-slate-900'
          }`}
        >
          <ShoppingCart size={28} />
        </Button>

        <Button 
          variant="outline"
          onClick={() => setState(prev => ({ ...prev, side: null }))}
          className={`h-16 px-6 rounded-full shadow-2xl border-4 font-black ${
            state.side === 'girl' ? 'bg-white border-pink-100 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          SWITCH SIDE
        </Button>
      </div>

      <AnimatePresence>
        {isShopOpen && (
          <Shop 
            side={state.side} 
            coins={state.coins} 
            onClose={() => setIsShopOpen(false)} 
            onBuy={handleBuyItem}
          />
        )}
      </AnimatePresence>

      <div className="fixed top-4 right-4 z-50">
        <Badge variant="outline" className="bg-white/50 backdrop-blur text-[10px] font-bold py-1 px-3">
          SIMULATED PURCHASES ONLY
        </Badge>
      </div>

      <footer className={`fixed bottom-2 right-4 z-10 text-[8px] font-bold uppercase tracking-widest ${
        state.side === 'girl' ? 'text-pink-300' : 'text-slate-700'
      }`}>
        © 2026 Sam Agaba | Kampala, Uganda
      </footer>
    </div>
  );
}
