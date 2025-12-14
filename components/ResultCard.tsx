import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { AnimatedNumber } from './AnimatedNumber';

interface ResultCardProps {
  title: string;
  value: number;
  currencySymbol: string;
  highlighted?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, value, currencySymbol, highlighted = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className={`p-4 ${highlighted ? 'bg-green-600 text-white' : 'bg-white'} shadow-lg`}>
        <p className={`text-sm mb-1 ${highlighted ? 'text-white' : 'text-gray-600'}`}>{title}</p>
        <AnimatedNumber value={value} prefix={currencySymbol} />
      </Card>
    </motion.div>
  );
};