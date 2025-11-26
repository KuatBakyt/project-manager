export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId: string;
  assigneeName?: string;
  dueDate?: string;
  status: TaskStatus;
  assignee?: string;
  files?: FileAttachment[];
  comments?: Comment[];
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  totalPages: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description?: string;
  assigneeId: string;
  dueDate?: string | null;
}

export interface UpdateTaskRequest {
  taskId: string;
  status: TaskStatus;
  title?: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string | null;
}

export type CommentText = string | { comment?: string; [key: string]: any };

export interface Comment {
  id: string;
  taskId: string;
  text: CommentText;
  author?: string;
  authorAvatar?: string;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UsersResponse {
  users: User[];
}
