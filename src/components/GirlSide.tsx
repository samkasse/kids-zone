import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Flower2, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Animal, Flower } from '@/src/types';
import confetti from 'canvas-confetti';

interface GirlSideProps {
  animals: Animal[];
  flowers: Flower[];
  onAction: (type: 'pet' | 'water' | 'contest', id: string) => void;
}

export const GirlSide: React.FC<GirlSideProps> = ({ animals, flowers, onAction }) => {
  const [activeTab, setActiveTab] = useState<'garden' | 'animals' | 'contest'>('garden');

  const handleContest = (animalId: string) => {
    onAction('contest', animalId);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#da70d6']
    });
  };

  return (
    <div className="min-h-screen bg-[#fff5f8] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-black text-pink-500 drop-shadow-sm flex items-center gap-2"
          >
            <Heart className="fill-pink-500" />
            Petal & Paws
            <Heart className="fill-pink-500" />
          </motion.h1>
          
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'garden' ? 'default' : 'outline'}
              onClick={() => setActiveTab('garden')}
              className="rounded-full bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200"
            >
              <Flower2 className="mr-2 h-4 w-4" /> Garden
            </Button>
            <Button 
              variant={activeTab === 'animals' ? 'default' : 'outline'}
              onClick={() => setActiveTab('animals')}
              className="rounded-full bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Nursery
            </Button>
            <Button 
              variant={activeTab === 'contest' ? 'default' : 'outline'}
              onClick={() => setActiveTab('contest')}
              className="rounded-full bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200"
            >
              <Trophy className="mr-2 h-4 w-4" /> Contests
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'garden' && (
            <motion.div 
              key="garden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              {flowers.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border-4 border-dashed border-pink-200">
                  <p className="text-pink-400 font-bold text-xl">Your garden is empty! Buy some seeds in the shop! 🌸</p>
                </div>
              )}
              {flowers.map(flower => (
                <Card key={flower.id} className="overflow-hidden rounded-3xl border-4 border-pink-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={flower.image} 
                        alt={flower.type} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black text-pink-600 uppercase tracking-widest">{flower.type}</span>
                          <span className="text-xs font-bold text-pink-400">{flower.growth}% Grown</span>
                        </div>
                        <Progress value={flower.growth} className="h-2 bg-pink-100" />
                      </div>
                    </div>
                    <div className="p-4">
                      <Button 
                        onClick={() => onAction('water', flower.id)}
                        disabled={flower.growth >= 100}
                        className="w-full bg-blue-400 hover:bg-blue-500 text-white rounded-xl font-bold"
                      >
                        {flower.growth >= 100 ? 'Fully Bloomed! ✨' : 'Water Flower 💧'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'animals' && (
            <motion.div 
              key="animals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {animals.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border-4 border-dashed border-pink-200">
                  <p className="text-pink-400 font-bold text-xl">No cute animals yet! Visit the shop to adopt! 🐰</p>
                </div>
              )}
              {animals.map(animal => (
                <Card key={animal.id} className="overflow-hidden rounded-3xl border-4 border-pink-100 shadow-lg">
                  <CardContent className="p-6 flex gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-pink-50 shrink-0">
                      <img 
                        src={animal.image} 
                        alt={animal.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-pink-600">{animal.name}</h3>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-xs font-bold text-pink-400">
                          <span>Cuteness</span>
                          <span>{animal.cuteness}%</span>
                        </div>
                        <Progress value={animal.cuteness} className="h-1.5 bg-pink-50" />
                        
                        <div className="flex justify-between text-xs font-bold text-pink-400">
                          <span>Beauty</span>
                          <span>{animal.beauty}%</span>
                        </div>
                        <Progress value={animal.beauty} className="h-1.5 bg-pink-50" />
                      </div>
                      <Button 
                        onClick={() => onAction('pet', animal.id)}
                        className="w-full mt-4 bg-pink-400 hover:bg-pink-500 text-white rounded-xl font-bold"
                      >
                        Pet & Love ❤️
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'contest' && (
            <motion.div 
              key="contest"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] p-8 border-8 border-pink-100 shadow-2xl text-center"
            >
              <h2 className="text-3xl font-black text-pink-500 mb-4">Grand Beauty Pageant</h2>
              <p className="text-pink-400 font-medium mb-8">Show off your cuties and win big prizes!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {animals.map(animal => (
                  <div key={animal.id} className="p-4 border-2 border-pink-50 rounded-2xl flex items-center justify-between bg-pink-50/30">
                    <div className="flex items-center gap-3">
                      <img src={animal.image} className="w-12 h-12 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                      <span className="font-bold text-pink-600">{animal.name}</span>
                    </div>
                    <Button 
                      onClick={() => handleContest(animal.id)}
                      className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-black rounded-full px-6"
                    >
                      Enter Contest!
                    </Button>
                  </div>
                ))}
              </div>
              {animals.length === 0 && <p className="text-pink-300 italic">Adopt animals to enter contests!</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
