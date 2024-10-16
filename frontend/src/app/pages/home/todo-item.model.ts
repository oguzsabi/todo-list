export interface ITodoItem {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: Date;
}

export interface ITodoParams {
  order_by: string;
  title?: string;
  completed?: boolean;
}
