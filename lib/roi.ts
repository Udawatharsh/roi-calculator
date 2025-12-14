export interface FormInputs {
  currency: string;
  industry: string;
  annualRevenue: number;
  grossMarginPct: number;
  avgInventory: number;
  carryingCostPct: number;
  expectedReductionPct: number;
  staffCount: number;
  avgCostPerPerson: number;
  hoursPerWeekManual: number;
  pctManualTimeReducible: number;
  pctOrdersLateOrIncomplete: number;
  pctSalesLost: number;
  pctRecoverable: number;
}

export interface ROIResults {
  inventorySavings: number;
  laborSavings: number;
  recoveredMargin: number;
  totalAnnualBenefit: number;
  totalBenefitPercentOfRevenue: number;
}

export const calculateROI = (data: FormInputs): ROIResults => {
  const carryingCost = data.avgInventory * (data.carryingCostPct / 100);
  const inventorySavings = carryingCost * (data.expectedReductionPct / 100);

  const manualFraction = data.hoursPerWeekManual / 40; 
  const manualCostPerPerson = data.avgCostPerPerson * manualFraction;
  const totalManualCost = manualCostPerPerson * data.staffCount;
  const laborSavings = totalManualCost * (data.pctManualTimeReducible / 100);

  const lostSales = data.annualRevenue * (data.pctSalesLost / 100);
  const recoverableSales = lostSales * (data.pctRecoverable / 100);
  const recoveredMargin = recoverableSales * (data.grossMarginPct / 100);

  const totalAnnualBenefit = inventorySavings + laborSavings + recoveredMargin;
  const totalBenefitPercentOfRevenue =
    data.annualRevenue > 0 ? (totalAnnualBenefit / data.annualRevenue) * 100 : 0;

  return {
    inventorySavings,
    laborSavings,
    recoveredMargin,
    totalAnnualBenefit,
    totalBenefitPercentOfRevenue,
  };
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    AUD: "A$",  
    ZAR: "R",   
  };

  return symbols[currency] ?? "$"; 
};