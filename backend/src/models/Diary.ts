export interface Diary {
  id: string;
  userId: string;
  date: string;
  generatedText: string;
  editedText?: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  userId: string;
  imageUrl: string;
  takenAt: Date;
  relatedLocationId?: string;
}

export class DiaryModel {
  id: string;
  userId: string;
  date: string;
  generatedText: string;
  editedText?: string;
  photos: Photo[];

  constructor(data: Diary) {
    this.id = data.id;
    this.userId = data.userId;
    this.date = data.date;
    this.generatedText = data.generatedText;
    this.editedText = data.editedText;
    this.photos = data.photos;
  }

  toFirestore() {
    return {
      userId: this.userId,
      date: this.date,
      generatedText: this.generatedText,
      editedText: this.editedText,
    };
  }

  static fromFirestore(id: string, data: any): Diary {
    return {
      id,
      userId: data.userId,
      date: data.date,
      generatedText: data.generatedText,
      editedText: data.editedText,
      photos: [], // Will be populated by resolver
    };
  }
} 