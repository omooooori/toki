export interface User {
  id: string;
  name?: string;
  createdAt: Date;
}

export class UserModel {
  id: string;
  name?: string;
  createdAt: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
  }

  toFirestore() {
    return {
      name: this.name,
      createdAt: this.createdAt,
    };
  }

  static fromFirestore(id: string, data: any): User {
    return {
      id,
      name: data.name,
      createdAt: data.createdAt.toDate(),
    };
  }
} 