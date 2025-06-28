export interface Diary {
    id: string;
    userId: string;
    content: string;
    location?: Location;
    photos: Photo[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
    placeName?: string;
}
export interface Photo {
    id: string;
    url: string;
    thumbnailUrl?: string;
    takenAt?: Date;
    location?: Location;
}
export interface CreateDiaryInput {
    content: string;
    location?: Location;
    photoUrls?: string[];
}
export interface UpdateDiaryInput {
    content?: string;
    location?: Location;
    photoUrls?: string[];
}
//# sourceMappingURL=diary.d.ts.map