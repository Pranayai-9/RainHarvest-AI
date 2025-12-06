export interface CalculatorInputs {
  city: string;
  roofArea: number; // m²
  rainfall: number; // mm/year
  runoffCoefficient: number; // 0-1
  annualDemand: number; // m³
  tankCost: number; // $
  installCost: number; // $
  maintenanceCost: number; // $/year
  waterPrice: number; // $/m³
  lifespan: number; // years
  discountRate: number; // %
}

export interface SimulationResult {
  annualCapture: number; // m³
  waterSaved: number; // m³
  annualSavings: number; // $
  initialInvestment: number; // $
  netPresentValue: number; // $
  roi: number; // %
  paybackPeriod: number | null; // years, null if never
  yearlyData: {
    year: number;
    cashflow: number;
    cumulative: number;
  }[];
}

export interface ClimateData {
  rainfall: number;
  city: string;
}
