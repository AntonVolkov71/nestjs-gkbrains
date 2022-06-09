export interface News {
  id: string;
  title: string;
  description: string;
  author?: string;
  cover?: string;
  createdAt: Date;
}
