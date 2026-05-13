import React from 'react';
import { motion } from "motion/react";
import { ShoppingBag, X, Star, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SHOP_ITEMS, CURRENCY_NAME } from '@/src/constants';

interface ShopProps {
  side: 'girl' | 'boy';
  coins: number;
  onClose: () => void;
  onBuy: (item: any) => void;
}

export const Shop: React.FC<ShopProps> = ({ side, coins, onClose, onBuy }) => {
  const items = SHOP_ITEMS[side];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`w-full max-w-5xl h-[80vh] rounded-[3rem] overflow-hidden flex flex-col border-8 ${
          side === 'girl' ? 'bg-pink-50 border-pink-200' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        <header className={`p-8 flex justify-between items-center border-b-4 ${
          side === 'girl' ? 'border-pink-100' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-3xl ${side === 'girl' ? 'bg-pink-500' : 'bg-yellow-400 text-black'}`}>
              <ShoppingBag size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Mega Store</h2>
              <p className={`font-bold ${side === 'girl' ? 'text-pink-400' : 'text-slate-400'}`}>
                Get the best stuff for your {side === 'girl' ? 'garden' : 'arsenal'}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border-4 ${
              side === 'girl' ? 'bg-white border-pink-200 text-pink-600' : 'bg-slate-800 border-slate-700 text-yellow-400'
            }`}>
              <Star className="fill-current" />
              <span className="text-2xl font-black">{coins}</span>
              <span className="text-xs font-bold uppercase">{CURRENCY_NAME}</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full hover:bg-black/10"
            >
              <X size={32} />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <Card 
                key={item.id} 
                className={`overflow-hidden rounded-[2.5rem] border-4 transition-all hover:scale-105 ${
                  side === 'girl' ? 'bg-white border-pink-100' : 'bg-slate-800 border-slate-700 text-white'
                }`}
              >
                <CardContent className="p-0 relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full aspect-square object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <Badge className={`absolute top-4 right-4 px-4 py-2 text-sm font-black rounded-full ${
                    side === 'girl' ? 'bg-pink-500' : 'bg-yellow-400 text-black'
                  }`}>
                    {item.type.toUpperCase()}
                  </Badge>
                </CardContent>
                <CardFooter className="p-6 flex flex-col gap-4">
                  <div className="w-full flex justify-between items-center">
                    <h3 className="text-xl font-black">{item.name}</h3>
                    <div className="flex items-center gap-1 font-black text-lg">
                      <Star size={18} className="fill-current" />
                      {item.price}
                    </div>
                  </div>
                  <Button 
                    onClick={() => onBuy(item)}
                    disabled={coins < item.price}
                    className={`w-full py-6 text-lg font-black rounded-2xl shadow-lg ${
                      side === 'girl' 
                        ? 'bg-pink-500 hover:bg-pink-600' 
                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                    }`}
                  >
                    {coins >= item.price ? 'PURCHASE' : 'NOT ENOUGH COINS'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};
