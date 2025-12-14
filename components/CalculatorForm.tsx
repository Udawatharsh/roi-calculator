"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { ConfirmModal } from "./ConfirmModal";
import {
  FormInputs,
  calculateROI,
  ROIResults,
  getCurrencySymbol,
} from "@/lib/roi";
import {
  InfoIcon,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";



const InfoTooltip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <InfoIcon className="w-4 h-4 text-red-500 hover:text-red-600 cursor-help transition-colors" />
    </TooltipTrigger>
    <TooltipContent
      side="top"
      className="bg-gray-900 text-white border border-gray-700"
    >
      <p className="max-w-xs">{text}</p>
    </TooltipContent>
  </Tooltip>
);

const formatNumberWithCommas = (value: string | number): string => {
  if (!value && value !== 0) return "";
  const numericValue = value.toString().replace(/,/g, "");
  if (isNaN(Number(numericValue))) return value.toString();

  if (numericValue.includes(".")) {
    const [integerPart, decimalPart] = numericValue.split(".");
    return `${Number(integerPart).toLocaleString("en-US")}.${decimalPart}`;
  }

  return Number(numericValue).toLocaleString("en-US");
};


export default function ROICalculator() {
  const [showModal, setShowModal] = useState(false);
  const [results, setResults] = useState<ROIResults | null>(null);
  const [formData, setFormData] = useState<FormInputs | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      currency: "USD",
      industry: "Apparel manufacturing",
      carryingCostPct: 20,
      expectedReductionPct: 15,
      pctManualTimeReducible: 60,
      pctOrdersLateOrIncomplete: 10,
      pctSalesLost: 5,
      pctRecoverable: 70,
    },
  });

  const selectedCurrency = watch("currency");
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const onSubmit = (data: FormInputs) => {
    const roi = calculateROI(data);
    setResults(roi);
    setFormData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
    setResults(null);
    setFormData(null);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="text-center mb-10">
            <div className="inline-block mb-4">
              <img src={"/calculator-logo.webp"} width={150} height={150} alt="Logo" />
            </div>

            <motion.h1
              className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              ROI Calculator
            </motion.h1>
            <motion.p
              className="text-gray-300 text-xl max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Discover the financial impact of AI implementation on your
              business
            </motion.p>
          </div>

          <Card className="p-8 md:p-12 shadow-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-200/50 rounded-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    General Information
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Currency
                    </label>
                    <select
                      {...register("currency")}
                      className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-white shadow-lg hover:shadow-xl font-medium text-lg"
                    >
                      <option value="USD">🇺🇸 United States Dollar (USD)</option>
                      <option value="EUR">🇪🇺 Euro (EUR)</option>
                      <option value="GBP">🇬🇧 British Pound (GBP)</option>
                      <option value="INR">🇮🇳 Indian Rupee (INR)</option>
                      <option value="AUD">🇦🇺 Australian Dollar (AUD)</option>
                      <option value="ZAR">🇿🇦 South African Rand (ZAR)</option>
                    </select>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Industry Sector
                    </label>
                    <select
                      {...register("industry")}
                      className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all bg-white shadow-lg hover:shadow-xl font-medium text-lg"
                    >
                      <option>👔 Apparel manufacturing</option>
                      <option>🏭 Other manufacturing</option>
                      <option>📦 Wholesale/distribution</option>
                      <option>🛍️ Retail</option>
                    </select>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Financial Metrics
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Annual Revenue
                      <InfoTooltip text="Total yearly revenue generated by your business. This is used to calculate percentage-based ROI metrics." />
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-lg z-10">
                        {currencySymbol}
                      </span>
                      <Controller
                        name="annualRevenue"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <input
                            type="text"
                            value={
                              field.value
                                ? formatNumberWithCommas(field.value)
                                : ""
                            }
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, "");
                              if (/^\d*$/.test(rawValue)) {
                                field.onChange(rawValue ? Number(rawValue) : 0);
                              }
                            }}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                            placeholder="1,000,000"
                          />
                        )}
                      />
                    </div>
                    {errors.annualRevenue && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 block font-semibold"
                      >
                        ⚠️ This field is required
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Gross Margin %
                      <InfoTooltip text="Your gross profit margin as a percentage. This represents the difference between revenue and cost of goods sold, divided by revenue." />
                    </label>
                    <div className="relative">
                      <Controller
                        name="grossMarginPct"
                        control={control}
                        rules={{ required: true, min: 0, max: 100 }}
                        render={({ field }) => (
                          <input
                            type="text"
                            value={
                              field.value || field.value === 0
                                ? field.value.toString()
                                : ""
                            }
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              if (/^\d*\.?\d{0,2}$/.test(rawValue)) {
                                const numValue = rawValue
                                  ? parseFloat(rawValue)
                                  : 0;
                                if (numValue <= 100 || rawValue.endsWith(".")) {
                                  field.onChange(
                                    rawValue === ""
                                      ? 0
                                      : rawValue.endsWith(".")
                                      ? rawValue
                                      : numValue
                                  );
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value.endsWith(".")) {
                                field.onChange(parseFloat(value) || 0);
                              }
                            }}
                            className="w-full pr-12 pl-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                            placeholder="25.5"
                          />
                        )}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-lg">
                        %
                      </span>
                    </div>
                    {errors.grossMarginPct && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 block font-semibold"
                      >
                        ⚠️ Must be between 0-100
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Average Inventory Value
                      <InfoTooltip text="The average value of inventory you keep in stock. This includes raw materials, work-in-progress, and finished goods." />
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-lg z-10">
                        {currencySymbol}
                      </span>
                      <Controller
                        name="avgInventory"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <input
                            type="text"
                            value={
                              field.value
                                ? formatNumberWithCommas(field.value)
                                : ""
                            }
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, "");
                              if (/^\d*$/.test(rawValue)) {
                                field.onChange(rawValue ? Number(rawValue) : 0);
                              }
                            }}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                            placeholder="500,000"
                          />
                        )}
                      />
                    </div>
                    {errors.avgInventory && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 block font-semibold"
                      >
                        ⚠️ This field is required
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Inventory Carrying Cost (%)
                      <InfoTooltip text="Annual cost to hold inventory as a percentage. Includes storage, insurance, depreciation, and opportunity costs. Typically 15-30%." />
                    </label>
                    <Controller
                      name="carryingCostPct"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={50}
                              step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <span className="text-lg font-bold text-purple-600 min-w-[60px] text-right">
                              {field.value}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>50%</span>
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Expected Reduction in Excess Inventory (%)
                      <InfoTooltip text="Percentage of excess inventory you expect to eliminate with AI-powered demand forecasting and optimization. Industry average: 10-20%." />
                    </label>
                    <Controller
                      name="expectedReductionPct"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={30}
                              step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                            />
                            <span className="text-lg font-bold text-green-600 min-w-[60px] text-right">
                              {field.value}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>30%</span>
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Labor & Operations
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Staff Count
                      <InfoTooltip text="Number of employees involved in inventory management, planning, and related operations." />
                    </label>
                    <Controller
                      name="staffCount"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <input
                          type="text"
                          value={
                            field.value
                              ? formatNumberWithCommas(field.value)
                              : ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, "");
                            if (/^\d*$/.test(rawValue)) {
                              field.onChange(rawValue ? Number(rawValue) : 0);
                            }
                          }}
                          className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                          placeholder="5"
                        />
                      )}
                    />
                    {errors.staffCount && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 block font-semibold"
                      >
                        ⚠️ This field is required
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Average Annual Cost per Person
                      <InfoTooltip text="Total annual employment cost per person including salary, benefits, taxes, and overhead." />
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-lg z-10">
                        {currencySymbol}
                      </span>
                      <Controller
                        name="avgCostPerPerson"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <input
                            type="text"
                            value={
                              field.value
                                ? formatNumberWithCommas(field.value)
                                : ""
                            }
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, "");
                              if (/^\d*$/.test(rawValue)) {
                                field.onChange(rawValue ? Number(rawValue) : 0);
                              }
                            }}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                            placeholder="60,000"
                          />
                        )}
                      />
                    </div>
                    {errors.avgCostPerPerson && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 block font-semibold"
                      >
                        ⚠️ This field is required
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      Hours/Week on Manual Tasks
                      <InfoTooltip text="Average hours per week each employee spends on manual, repetitive inventory-related tasks that could be automated." />
                    </label>
                    <Controller
                      name="hoursPerWeekManual"
                      control={control}
                      rules={{ required: true, min: 0, max: 40 }}
                      render={({ field }) => (
                        <input
                          type="text"
                          value={
                            field.value || field.value === 0
                              ? field.value.toString()
                              : ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            if (/^\d*\.?\d{0,1}$/.test(rawValue)) {
                              const numValue = rawValue
                                ? parseFloat(rawValue)
                                : 0;
                              if (numValue <= 40 || rawValue.endsWith(".")) {
                                field.onChange(
                                  rawValue === ""
                                    ? 0
                                    : rawValue.endsWith(".")
                                    ? rawValue
                                    : numValue
                                );
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value.endsWith(".")) {
                              field.onChange(parseFloat(value) || 0);
                            }
                          }}
                          className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                          placeholder="20"
                        />
                      )}
                    />
                    {errors.hoursPerWeekManual && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 block font-semibold"
                      >
                        ⚠️ Must be between 0-40
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      % Manual Time Reducible with AI
                      <InfoTooltip text="Percentage of manual work time that can be automated or significantly reduced using AI. Conservative estimate: 40-60%." />
                    </label>
                    <Controller
                      name="pctManualTimeReducible"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={80}
                              step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <span className="text-lg font-bold text-blue-600 min-w-[60px] text-right">
                              {field.value}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>80%</span>
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Sales Impact
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      % Orders Late/Incomplete/Rushed
                      <InfoTooltip text="Percentage of orders that are delayed, incomplete, or require rush processing due to inventory issues. This impacts customer satisfaction." />
                    </label>
                    <Controller
                      name="pctOrdersLateOrIncomplete"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={30}
                              step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                            <span className="text-lg font-bold text-orange-600 min-w-[60px] text-right">
                              {field.value}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>30%</span>
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      % Sales Lost Due to Stockouts/Delays
                      <InfoTooltip text="Percentage of potential sales lost when products are out of stock or delivery is delayed. Customers may go to competitors." />
                    </label>
                    <Controller
                      name="pctSalesLost"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={20}
                              step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                            <span className="text-lg font-bold text-red-600 min-w-[60px] text-right">
                              {field.value}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>20%</span>
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    className="md:col-span-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-gray-700 flex items-center gap-2">
                      % Lost Sales Recoverable with AI
                      <InfoTooltip text="Percentage of lost sales you can recover by improving inventory availability and forecasting with AI technology. Typical range: 60-80%." />
                    </label>
                    <Controller
                      name="pctRecoverable"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={90}
                              step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <span className="text-lg font-bold text-emerald-600 min-w-[60px] text-right">
                              {field.value}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0%</span>
                            <span>90%</span>
                          </div>
                        </div>
                      )}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-6"
              >
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-black py-6 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:shadow-purple-500/50 text-xl flex items-center justify-center gap-3 group"
                >
                  <span>Calculate ROI</span>
                  <TrendingUp className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </form>
          </Card>
        </motion.div>

        {results && formData && (
          <ConfirmModal
            isOpen={showModal}
            onClose={handleCloseModal}
            results={results}
            formData={formData}
          />
        )}
      </div>
    </TooltipProvider>
  );
}