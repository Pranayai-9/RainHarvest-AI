import { CalculatorInputs, SimulationResult } from '../types';

export const calculateROI = (inputs: CalculatorInputs): SimulationResult => {
  const {
    roofArea,
    rainfall,
    runoffCoefficient,
    annualDemand,
    tankCost,
    installCost,
    maintenanceCost,
    waterPrice,
    lifespan,
    discountRate,
  } = inputs;

  // 1. Physical Capture
  // Capture (m³) = Area (m²) * Rainfall (m) * Runoff
  const annualCapture = roofArea * (rainfall / 1000) * runoffCoefficient;

  // 2. Utilisation
  // Cannot save more than we demand or capture
  const waterSaved = Math.min(annualCapture, annualDemand);

  // 3. Financials
  const annualSavings = waterSaved * waterPrice;
  const annualNetCashflow = annualSavings - maintenanceCost;
  const initialInvestment = tankCost + installCost;

  let cumulativeCash = -initialInvestment;
  let paybackPeriod: number | null = null;
  let netPresentValue = -initialInvestment;
  const yearlyData = [];

  // 4. Projection Loop
  for (let year = 1; year <= lifespan; year++) {
    cumulativeCash += annualNetCashflow;
    
    // Check payback (first year we cross into positive)
    if (paybackPeriod === null && cumulativeCash >= 0) {
      // Simple linear interpolation for fractional year payback could be added, 
      // but integer year is standard for simple calculators.
      paybackPeriod = year;
    }

    // NPV Calculation
    // Cashflow / (1 + r)^t
    const discountFactor = Math.pow(1 + discountRate / 100, year);
    netPresentValue += annualNetCashflow / discountFactor;

    yearlyData.push({
      year,
      cashflow: annualNetCashflow,
      cumulative: cumulativeCash,
    });
  }

  // 5. ROI (Simple)
  // (Total Net Profit / Total Investment) * 100
  // Total Net Profit = (Annual Net * Lifespan) - Investment
  const totalNetProfit = (annualNetCashflow * lifespan) - initialInvestment;
  const roi = (totalNetProfit / initialInvestment) * 100;

  return {
    annualCapture,
    waterSaved,
    annualSavings,
    initialInvestment,
    netPresentValue,
    roi,
    paybackPeriod,
    yearlyData,
  };
};
