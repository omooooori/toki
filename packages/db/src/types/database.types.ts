export type DatabaseConfig = {
  type: 'firebase';
  firebase: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
  };
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Diary = {
  id: string;
  userId: string;
  content: string;
  location?: Location;
  photoUrls: string[];
  aiAnalysis?: AIAnalysis;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDiaryInput = {
  userId: string;
  content: string;
  location?: Location;
  photoUrls?: string[];
};

export type UpdateDiaryInput = {
  content?: string;
  location?: Location;
  photoUrls?: string[];
  aiAnalysis?: AIAnalysis;
};

export type DiaryQueryOptions = {
  userId: string;
  limit?: number;
  offset?: number;
};

export type Location = {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
};

export type AIAnalysis = {
  sentiment: string;
  topics: string[];
  summary: string;
  suggestions: string[];
}; 