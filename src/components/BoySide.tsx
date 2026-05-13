import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Zap, Target, Rocket, Bomb, Crosshair, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Weapon } from '@/src/types';
import confetti from 'canvas-confetti';

interface BoySideProps {
  weapons: Weapon[];
  destructionScore: number;
  onAction: (type: 'shoot' | 'upgrade', id: string) => void;
}

export const BoySide: React.FC<BoySideProps> = ({ weapons, destructionScore, onAction }) => {
  const [targets, setTargets] = useState<{ id: number, x: number, y: number, type: 'car' | 'building' | 'robot', health: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (targets.length < 5) {
        setTargets(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          type: ['car', 'building', 'robot'][Math.floor(Math.random() * 3)] as any,
          health: 100
        }]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [targets]);

  const handleShoot = (targetId: number) => {
    const activeWeapon = weapons.find(w => w.unlocked) || weapons[0];
    onAction('shoot', activeWeapon.id);
    
    setTargets(prev => prev.map(t => {
      if (t.id === targetId) {
        const newHealth = t.health - (activeWeapon.power * 20);
        if (newHealth <= 0) {
          // Explosion effect
          confetti({
            particleCount: 50,
            spread: 30,
            origin: { x: t.x / 100, y: t.y / 100 },
            colors: ['#ff4500', '#ff8c00', '#ffff00']
          });
          return null;
        }
        return { ...t, health: newHealth };
      }
      return t;
    }).filter(Boolean) as any);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-mono text-white overflow-hidden relative">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8 border-b-2 border-slate-800 pb-4">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-black italic text-yellow-400 flex items-center gap-2 tracking-tighter"
          >
            <Zap className="fill-yellow-400" />
            DESTRUCTO-ZONE
            <Zap className="fill-yellow-400" />
          </motion.h1>
          
          <div className="flex items-center gap-6 bg-slate-900/80 backdrop-blur px-6 py-3 rounded-full border border-slate-700 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Destruction Level</span>
              <span className="text-2xl font-black text-blue-400">{destructionScore}</span>
            </div>
            <Target className="text-red-500 animate-pulse" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Weapon Selection */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Arsenal</h2>
            {weapons.map(weapon => (
              <Card 
                key={weapon.id} 
                className={`bg-slate-900 border-2 transition-all cursor-pointer ${weapon.unlocked ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-800 opacity-50'}`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center">
                    <img src={weapon.image} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{weapon.name}</h4>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-1 w-3 rounded-full ${i < weapon.power ? 'bg-yellow-400' : 'bg-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Battle Arena */}
          <div 
            ref={containerRef}
            className="lg:col-span-3 bg-slate-900/50 rounded-3xl border-2 border-slate-800 h-[600px] relative overflow-hidden shadow-inner"
          >
            <AnimatePresence>
              {targets.map(target => (
                <motion.div
                  key={target.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="absolute cursor-crosshair group"
                  style={{ left: `${target.x}%`, top: `${target.y}%` }}
                  onClick={() => handleShoot(target.id)}
                >
                  <div className="relative">
                    <div className="absolute -top-6 left-0 right-0">
                      <Progress value={target.health} className="h-1 bg-slate-800" />
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 group-hover:border-red-500 transition-colors">
                      {target.type === 'car' && <Rocket className="w-12 h-12 text-blue-400" />}
                      {target.type === 'building' && <ShieldAlert className="w-12 h-12 text-purple-400" />}
                      {target.type === 'robot' && <Bomb className="w-12 h-12 text-green-400" />}
                    </div>
                    <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {targets.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-slate-600 font-black text-2xl animate-pulse">SCANNING FOR TARGETS...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
