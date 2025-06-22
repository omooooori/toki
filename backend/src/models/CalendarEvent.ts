export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

export class CalendarEventModel {
  id: string;
  userId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;

  constructor(data: CalendarEvent) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.location = data.location;
  }

  toFirestore() {
    return {
      userId: this.userId,
      title: this.title,
      startTime: this.startTime,
      endTime: this.endTime,
      location: this.location,
    };
  }

  static fromFirestore(id: string, data: any): CalendarEvent {
    return {
      id,
      userId: data.userId,
      title: data.title,
      startTime: data.startTime.toDate(),
      endTime: data.endTime.toDate(),
      location: data.location,
    };
  }
} 