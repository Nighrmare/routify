import { Injectable } from "@nestjs/common";
import { TransportType } from "src/entities/transport.entity";
import { TransportOption } from "src/interfaces/transport-comparison.interface";

@Injectable()
export class TransportSimulatorService {
  simulateTransportOptions(origin: string, destination: string): TransportOption[] {
    const baseDistance = Math.random() * 15 + 5; // 5-20 km
    const options: TransportOption[] = [];

    // Bus
    options.push({
      type: TransportType.BUS,
      distance: parseFloat(baseDistance.toFixed(2)),
      duration: parseFloat((Math.round(baseDistance * 4 + Math.random() * 10)).toFixed(2)),
      cost: 2800 + parseFloat((Math.random() * 500).toFixed(2)),
      comfort: 5 + parseFloat((Math.random() * 2).toFixed(2)),
      reliability: 6 + parseFloat((Math.random() * 2).toFixed(2)),
      score: 0,
      notes: 'Public transport service with multiple stops',
    });

    // Taxi
    options.push({
      type: TransportType.TAXI,
      distance: parseFloat(baseDistance.toFixed(2)),
      duration: parseFloat(Math.round(baseDistance * 2.5 + Math.random() * 5).toFixed(2)),
      cost: 6000 + baseDistance * 2500,
      comfort: 7 + parseFloat((Math.random() * 2).toFixed(2)),
      reliability: 8 + parseFloat((Math.random() * 1.5).toFixed(2)),
      score: 0,
      notes: ' Door-to-door service',
    });

    // Metro (only for short distances)
    if (baseDistance < 15) {
      options.push({
        type: TransportType.METRO,
        distance: parseFloat((baseDistance * 0.9).toFixed(2)),
        duration: parseFloat(Math.round(baseDistance * 2 + Math.random() * 5).toFixed(2)),
        cost: 2800,
        comfort: 6 + parseFloat((Math.random() * 2).toFixed(2)),
        reliability: 9 + parseFloat((Math.random() * 0.8).toFixed(2)),
        score: 0,
        notes: 'Fast and reliable during peak hours',
      });
    }

    // Bicycle
    if (baseDistance < 10) {
      options.push({
        type: TransportType.BICYCLE,
        distance: parseFloat((baseDistance * 1.1).toFixed(2)),
        duration: parseFloat(Math.round(baseDistance * 5 + Math.random() * 10).toFixed(2)),
        cost: 0,
        comfort: 4 + parseFloat((Math.random() * 2).toFixed(2)),
        reliability: 7 + parseFloat((Math.random() * 2).toFixed(2)),
        score: 0,
        notes: 'Healthy and eco-friendly option',
      });
    }

    // Walking
    if (baseDistance < 5) {
      options.push({
        type: TransportType.WALKING,
        distance: parseFloat((baseDistance * 1.15).toFixed(2)),
        duration: parseFloat(Math.round(baseDistance * 15 + Math.random() * 10).toFixed(2)),
        cost: 0,
        comfort: 3 + parseFloat((Math.random() * 2).toFixed(2)),
        reliability: 10,
        score: 0,
        notes: 'Completely free and healthy option',
      });
    }

    // Car
    options.push({
      type: TransportType.PRIVATE_CAR,
      distance: parseFloat(baseDistance.toFixed(2)),
      duration: parseFloat(Math.round(baseDistance * 2 + Math.random() * 8).toFixed(2)),
      cost: baseDistance * 1500 + 3000, // gas + parking
      comfort: 9 + parseFloat((Math.random() * 0.8).toFixed(2)),
      reliability: 8 + parseFloat((Math.random() * 1.5).toFixed(2)),
      score: 0,
      notes: 'Includes fuel and parking costs',
    });

    // Calculate score (weighted)
    options.forEach(option => {
      const normalizedCost = 1 - (option.cost / Math.max(...options.map(o => o.cost)));
      const normalizedTime = 1 - (option.duration / Math.max(...options.map(o => o.duration)));
      const normalizedComfort = option.comfort / 10;
      const normalizedReliability = option.reliability / 10;

      option.score = (
        normalizedCost * 0.25 +
        normalizedTime * 0.25 +
        normalizedComfort * 0.25 +
        normalizedReliability * 0.25
      ) * 10;
      option.score = Math.round(option.score * 100) / 100;
    });

    return options;
  }
}