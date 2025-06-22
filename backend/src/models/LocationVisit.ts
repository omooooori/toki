export interface LocationVisit {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  placeName?: string;
  address?: string;
  visitedAt: Date;
  durationMinutes?: number;
}

export class LocationVisitModel {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  placeName?: string;
  address?: string;
  visitedAt: Date;
  durationMinutes?: number;

  constructor(data: LocationVisit) {
    this.id = data.id;
    this.userId = data.userId;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.placeName = data.placeName;
    this.address = data.address;
    this.visitedAt = data.visitedAt;
    this.durationMinutes = data.durationMinutes;
  }

  toFirestore() {
    return {
      userId: this.userId,
      latitude: this.latitude,
      longitude: this.longitude,
      placeName: this.placeName,
      address: this.address,
      visitedAt: this.visitedAt,
      durationMinutes: this.durationMinutes,
    };
  }

  static fromFirestore(id: string, data: any): LocationVisit {
    return {
      id,
      userId: data.userId,
      latitude: data.latitude,
      longitude: data.longitude,
      placeName: data.placeName,
      address: data.address,
      visitedAt: data.visitedAt.toDate(),
      durationMinutes: data.durationMinutes,
    };
  }
} 