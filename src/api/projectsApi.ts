import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  type CreateProjectRequest,
  type CreateTaskRequest,
  type Project,
  type ProjectsResponse,
  type Task,
  type TasksResponse,
  type UpdateTaskRequest, type User,
} from 'types/projects';

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://master.dev.solvatech.kz/lab-api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    'Projects',
    'Tasks',
    'User',
  ],
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, { page: number; limit: number; sort?: string }>({
      query: ({ page, limit, sort }) => {
        let url = `/projects?page=${page}&limit=${limit}`;

        if (sort) {
          url += `&sort=${sort}`;
        }

        return url;
      },
      providesTags: ['Projects'],
    }),

    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    getTasks: builder.query<TasksResponse, string>({
      query: (projectId) => `/projects/${projectId}/tasks`,
      providesTags: ['Tasks'],
    }),
    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTask: builder.mutation<Task, UpdateTaskRequest>({
      query: ({ taskId, status }) => ({
        url: `/tasks/${taskId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Tasks'],
    }),
    getProjectById: builder.query<Project, string>({
      query: (projectId) => `/projects/${projectId}`,
      providesTags: ['Projects'],
    }),
    getTaskById: builder.query<Task, string>({
      query: (taskId) => `/tasks/${taskId}`,
      providesTags: ['Tasks'],
    }),
    uploadFile: builder.mutation<any, { taskId: string; file: File }>({
      query: ({ taskId, file }) => {
        const formData = new FormData();

        formData.append('file', file);

        return {
          url: `/tasks/${taskId}/files`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Tasks'],
    }),
    addComment: builder.mutation<Comment, { taskId: string; text: string }>({
      query: ({ taskId, text }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),

  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetProjectByIdQuery,
  useGetTaskByIdQuery,
  useUploadFileMutation,
  useAddCommentMutation,
  useDeleteTaskMutation,
  useGetUsersQuery,
} = projectsApi;
