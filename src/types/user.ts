export interface User {
  id: string;
  username: string;
  createdAt: string;
  assignedTasks: Task[];
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  project: string;
}

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'In Progress',
  Done = 'Done',
}
