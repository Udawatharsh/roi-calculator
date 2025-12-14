'use client';
import dynamic from 'next/dynamic';

const ROICalculator = dynamic(
  () => import('@/components/CalculatorForm'),
  { ssr: false }
);

export default function Home() {
  return <ROICalculator />;
}