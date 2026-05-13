import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PopUpManagerProps {
  onBuy: (price: number, itemId: string) => void;
  side: 'girl' | 'boy' | null;
}

export const PopUpManager: React.FC<PopUpManagerProps> = ({ onBuy, side }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [offer, setOffer] = useState<{ id: string, name: string, price: number, image: string } | null>(null);

  useEffect(() => {
    if (!side) return;

    const interval = setInterval(() => {
      const offers = side === 'girl' ? [
        { id: 'mega_unicorn', name: 'SUPER MAGIC UNICORN', price: 9.99, image: 'https://picsum.photos/seed/megaunicorn/400/400' },
        { id: 'diamond_garden', name: 'DIAMOND GARDEN SET', price: 14.99, image: 'https://picsum.photos/seed/diamondgarden/400/400' },
      ] : [
        { id: 'nuke', name: 'OMEGA NUKE LAUNCHER', price: 19.99, image: 'https://picsum.photos/seed/nuke/400/400' },
        { id: 'mech', name: 'GIANT BATTLE MECH', price: 29.99, image: 'https://picsum.photos/seed/mech/400/400' },
      ];

      const randomOffer = offers[Math.floor(Math.random() * offers.length)];
      setOffer(randomOffer);
      setIsOpen(true);
    }, 45000); // Every 45 seconds for demo purposes

    return () => clearInterval(interval);
  }, [side]);

  const handleBuy = () => {
    if (offer) {
      // In a real app, this would trigger a real IAP
      // Here we just simulate it
      onBuy(0, offer.id); // Price 0 because it's "real money" simulation
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`sm:max-w-[425px] border-4 ${side === 'girl' ? 'border-pink-400 bg-pink-50' : 'border-yellow-400 bg-slate-900 text-white'}`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center flex items-center justify-center gap-2">
            {side === 'girl' ? <Sparkles className="text-pink-500" /> : <Zap className="text-yellow-400" />}
            LIMITED TIME OFFER!
            {side === 'girl' ? <Sparkles className="text-pink-500" /> : <Zap className="text-yellow-400" />}
          </DialogTitle>
          <DialogDescription className={`text-center font-bold ${side === 'girl' ? 'text-pink-600' : 'text-yellow-200'}`}>
            Don't miss out! This offer expires in 59 seconds!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="relative"
          >
            <img 
              src={offer?.image} 
              alt={offer?.name} 
              className="w-48 h-48 rounded-2xl shadow-2xl border-4 border-white"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-4 -right-4 bg-red-500 text-white font-black px-4 py-2 rounded-full rotate-12 shadow-lg">
              -90% OFF!
            </div>
          </motion.div>
          <h3 className="mt-6 text-xl font-black text-center">{offer?.name}</h3>
          <p className="text-3xl font-black mt-2 text-green-500">${offer?.price}</p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={handleBuy}
            className={`w-full py-8 text-2xl font-black rounded-2xl shadow-xl transition-transform hover:scale-105 ${
              side === 'girl' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600'
            }`}
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            BUY NOW!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
