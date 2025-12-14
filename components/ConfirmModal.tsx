import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Download,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { FormInputs, ROIResults, getCurrencySymbol } from "@/lib/roi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import emailjs from "@emailjs/browser";
// @ts-expect-error cause of this is unknown
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ROIResults;
  formData: FormInputs;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  results,
  formData,
}) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [statusMessage, setStatusMessage] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const currencySymbol = getCurrencySymbol(formData.currency);

  const EMAILJS_SERVICE_ID = "service_ao8aepf";
  const EMAILJS_TEMPLATE_ID = "template_usv01nq";
  const EMAILJS_PUBLIC_KEY = "DESmwW2TmkYCpVQ4X";

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;

    setIsDownloading(true);

    try {
      const element = reportRef.current;

      const dataUrl = await domtoimage.toPng(element, {
        quality: 1,
        bgcolor: "#ffffff",
        cacheBust: true,
        style: {
          margin: "0",
          padding: "0",
        },
      });

      const img = new Image();
      img.src = dataUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (img.height * imgWidth) / img.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          dataUrl,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pageHeight;
      }

      const fileName = `ROI-Report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      setSendStatus("success");
      setStatusMessage("Report downloaded successfully!");

      setTimeout(() => {
        setSendStatus("idle");
        setStatusMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSendStatus("error");
      setStatusMessage("Failed to download report. Please try again.");

      setTimeout(() => {
        setSendStatus("idle");
        setStatusMessage("");
      }, 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendReport = async () => {
    if (!email) return;

    setIsSending(true);
    setSendStatus("idle");
    setStatusMessage("");

    const templateParams = {
      to_email: email,
      subject: "Your ROI Calculation Results",

      inventory_savings: `${currencySymbol}${results.inventorySavings.toLocaleString()}`,
      labor_savings: `${currencySymbol}${results.laborSavings.toLocaleString()}`,
      recovered_margin: `${currencySymbol}${results.recoveredMargin.toLocaleString()}`,
      total_annual_benefit: `${currencySymbol}${results.totalAnnualBenefit.toLocaleString()}`,
      roi_percentage: `${results.totalBenefitPercentOfRevenue.toFixed(2)}%`,

      currency: formData.currency,
      industry: formData.industry,
      annual_revenue: `${currencySymbol}${formData.annualRevenue.toLocaleString()}`,
      gross_margin: `${formData.grossMarginPct}%`,
      avg_inventory: `${currencySymbol}${formData.avgInventory.toLocaleString()}`,
      carrying_cost: `${formData.carryingCostPct}%`,
      staff_count: formData.staffCount,
      hours_manual: formData.hoursPerWeekManual,
      expected_reduction: `${formData.expectedReductionPct}%`,
      manual_time_reducible: `${formData.pctManualTimeReducible}%`,
      orders_late: `${formData.pctOrdersLateOrIncomplete}%`,
      sales_lost: `${formData.pctSalesLost}%`,
      recoverable: `${formData.pctRecoverable}%`,
    };

    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setSendStatus("success");
        setStatusMessage(`Report successfully sent to ${email}!`);

        setTimeout(() => {
          setEmail("");
          setSendStatus("idle");
          setStatusMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSendStatus("error");
      setStatusMessage(
        "Failed to send report. Please try again or check your email configuration."
      );
    } finally {
      setIsSending(false);
    }
  };

  const barChartData = [
    {
      name: "Inventory Savings",
      amount: results.inventorySavings,
      fill: "#10b981",
    },
    {
      name: "Labor Savings",
      amount: results.laborSavings,
      fill: "#3b82f6",
    },
    {
      name: "Recovered Margin",
      amount: results.recoveredMargin,
      fill: "#8b5cf6",
    },
  ];

  const pieChartData = [
    { name: "Inventory Savings", value: results.inventorySavings },
    { name: "Labor Savings", value: results.laborSavings },
    { name: "Recovered Margin", value: results.recoveredMargin },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
                >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-white" />
                  <h2 className="text-3xl font-bold text-white">
                    ROI Calculation Results
                  </h2>
                </div>
                <p className="text-indigo-100">
                  Based on your inputs, here&apos;s your projected return on
                  investment
                </p>
              </div>

              <div className="overflow-y-auto p-6 space-y-6">
                <div ref={reportRef} className="bg-white" data-report-content>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200"
                  >
                    <h3 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
                      💰 Annual Benefits
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <motion.div
                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.03 }}
                      >
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          Inventory Savings
                        </p>
                        <AnimatedNumber
                          value={results.inventorySavings}
                          prefix={currencySymbol}
                          className="text-2xl font-bold text-green-600"
                        />
                      </motion.div>
                      <motion.div
                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.03 }}
                      >
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          Labor Savings
                        </p>
                        <AnimatedNumber
                          value={results.laborSavings}
                          prefix={currencySymbol}
                          className="text-2xl font-bold text-blue-600"
                        />
                      </motion.div>
                      <motion.div
                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.03 }}
                      >
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          Recovered Margin
                        </p>
                        <AnimatedNumber
                          value={results.recoveredMargin}
                          prefix={currencySymbol}
                          className="text-2xl font-bold text-purple-600"
                        />
                      </motion.div>
                      <motion.div
                        className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-5 rounded-xl shadow-lg"
                        whileHover={{ scale: 1.03 }}
                      >
                        <p className="text-sm mb-2 font-medium opacity-90">
                          Total Annual Benefit
                        </p>
                        <AnimatedNumber
                          value={results.totalAnnualBenefit}
                          prefix={currencySymbol}
                          className="text-2xl font-bold"
                        />
                      </motion.div>
                    </div>
                    <div className="mt-6 text-center bg-white p-4 rounded-xl shadow-md">
                      <p className="text-lg flex items-center justify-center gap-2">
                        <span className="font-semibold text-gray-700">
                          ROI as % of Revenue:
                        </span>
                        <AnimatedNumber
                          value={results.totalBenefitPercentOfRevenue}
                          suffix="%"
                          className="text-2xl font-bold text-green-600"
                        />
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-2 gap-6 mt-6"
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                      <h4 className="text-lg font-bold mb-4 text-gray-800">
                        Benefits Breakdown
                      </h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barChartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            angle={-15}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            formatter={(value: number) =>
                              `${currencySymbol}${value.toLocaleString()}`
                            }
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                            {barChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                      <h4 className="text-lg font-bold mb-4 text-gray-800">
                        Contribution Distribution
                      </h4>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="45%"
                            outerRadius={85}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ percent }) =>
                              // @ts-expect-error cause of this is unknown
                              `${(percent * 100).toFixed(0)}%`
                            }
                            labelLine={true}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [
                              `${currencySymbol}${value.toLocaleString()}`,
                              "Amount",
                            ]}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid #e5e7eb",
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 mt-6"
                  >
                    <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                      📋 Your Inputs
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Currency:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {formData.currency}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Industry:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {formData.industry}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Annual Revenue:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {currencySymbol}
                          {formData.annualRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Gross Margin:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {formData.grossMarginPct}%
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Avg Inventory:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {currencySymbol}
                          {formData.avgInventory.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Carrying Cost:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {formData.carryingCostPct}%
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Staff Count:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {formData.staffCount}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="font-semibold text-gray-700">
                          Hours/Week Manual:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {formData.hoursPerWeekManual}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-6 rounded-xl border-2 border-indigo-200 space-y-4"
                >
                  {/* Download Button */}
                  {/* <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <Download className="w-5 h-5 text-indigo-600" />
                      Download Report as PDF
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadReport}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download Report
                        </>
                      )}
                    </motion.button>
                  </div> */}

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      Email Address (to receive report)
                    </label>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="your@email.com"
                          disabled={isSending}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSendReport}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
                          disabled={!email || isSending}
                        >
                          {isSending ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              Send Report
                            </>
                          )}
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {sendStatus === "success" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-sm text-green-700 font-medium">
                              {statusMessage}
                            </p>
                          </motion.div>
                        )}

                        {sendStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-sm text-red-700 font-medium">
                              {statusMessage}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Report
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                >
                  Close & Reset
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
