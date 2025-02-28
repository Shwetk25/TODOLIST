export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  reminder?: boolean;
  reminderSent?: boolean;
}

export type FilterType = 'all' | 'active' | 'completed' | 'upcoming';