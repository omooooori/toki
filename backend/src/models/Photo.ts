export interface Photo {
  id: string;
  userId: string;
  imageUrl: string;
  takenAt: Date;
  relatedLocationId?: string;
}

export class PhotoModel {
  id: string;
  userId: string;
  imageUrl: string;
  takenAt: Date;
  relatedLocationId?: string;

  constructor(data: Photo) {
    this.id = data.id;
    this.userId = data.userId;
    this.imageUrl = data.imageUrl;
    this.takenAt = data.takenAt;
    this.relatedLocationId = data.relatedLocationId;
  }

  toFirestore() {
    return {
      userId: this.userId,
      imageUrl: this.imageUrl,
      takenAt: this.takenAt,
      relatedLocationId: this.relatedLocationId,
    };
  }

  static fromFirestore(id: string, data: any): Photo {
    return {
      id,
      userId: data.userId,
      imageUrl: data.imageUrl,
      takenAt: data.takenAt.toDate(),
      relatedLocationId: data.relatedLocationId,
    };
  }
} 