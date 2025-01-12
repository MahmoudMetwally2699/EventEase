export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  maxAttendees: number;
  organizerId: string;
  organizer: {
    id: string;
    name: string | null;
    email: string;
  };
  attendees: Array<{
    userId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}
