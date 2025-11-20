export interface TransportOption {
  type: string;
  distance: number;
  duration: number;
  cost: number;
  comfort: number;
  reliability: number;
  score: number;
  notes?: string;
}

export interface ComparisonResult {
  origin: string;
  destination: string;
  options: TransportOption[];
  recommended: TransportOption;
  fastest: TransportOption;
  cheapest: TransportOption;
}