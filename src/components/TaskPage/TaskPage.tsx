import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button, Card, HTMLSelect, Icon, InputGroup,
} from '@blueprintjs/core';
import {
  useAddCommentMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery, useGetUsersQuery,
  useUpdateTaskMutation,
  useUploadFileMutation,
} from 'api/projectsApi';
import type { TaskStatus } from 'types/projects';

const TaskPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const { data: task, isLoading } = useGetTaskByIdQuery(taskId!);
  const comments = task?.comments ?? [];

  const { data: users = [] } = useGetUsersQuery();
  const assigneeName = users.find((u) => u.id === task?.assigneeId)?.username;

  const [updateTask] = useUpdateTaskMutation();
  const [uploadFile] = useUploadFileMutation();
  const [addComment] = useAddCommentMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [commentText, setCommentText] = useState('');

  if (isLoading) {
    return <p>Загрузка задачи...</p>;
  }

  const handleUpdateStatus = async (status: TaskStatus) => {
    try {
      await updateTask({ taskId: taskId!, status });
    } catch (err) {
      alert(`Ошибка обновления: ${err}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskId!);
      alert('Удаление пока недоступно');
    } catch (err) {
      alert(`Ошибка удаления: ${err}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadFile({ taskId: taskId!, file: e.target.files[0] });
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment({ taskId: taskId!, text: commentText });
      setCommentText('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>

      <Card elevation={2} style={{ marginBottom: '20px', padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button icon="arrow-left" onClick={() => navigate(-1)} />
          <h2 style={{ margin: 0 }}>{task?.title}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>

            <HTMLSelect
              fill
              onChange={(e) => handleUpdateStatus(e.target.value as TaskStatus)}
              options={[
                { label: '📝 Новая', value: 'new' },
                { label: '🚧 В работе', value: 'in_progress' },
                { label: '✅ Завершена', value: 'done' },
              ]}
              value={task?.status}
            />

            <Button icon="trash" intent="danger" onClick={handleDelete}>
              Удалить задачу
            </Button>
          </div>
        </div>
      </Card>

      <Card elevation={1} style={{ marginBottom: '20px', padding: '15px' }}>
        <p>
          <Icon icon="edit" />
          {' '}
          {task?.description}
        </p>
        <p>
          <Icon icon="person" />
          {' '}
          Исполнитель:
          {' '}
          {assigneeName ?? 'Не назначен'}
        </p>
        <p>
          <Icon icon="calendar" />
          {' '}
          Дедлайн:
          {' '}
          {task?.dueDate
            ? new Date(task.dueDate).toLocaleDateString('ru-RU')
            : 'Не указан'}

        </p>
      </Card>

      <Card elevation={1} style={{ marginBottom: '20px', padding: '15px' }}>
        <h3>
          <Icon icon="paperclip" />
          {' '}
          Файлы
        </h3>
        <input onChange={handleFileUpload} style={{ marginBottom: '10px' }} type="file" />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {task?.files?.map((file, i) => (
            <li key={file.id ?? i} style={{ marginBottom: '8px' }}>
              <Icon icon="document" />
              {' '}
              <a href={file.filename} rel="noopener noreferrer" target="_blank">
                {file.originalName}
              </a>
              <small style={{ marginLeft: '10px', color: '#5c7080' }}>
                Загружено:
                {' '}
                {new Date(file.uploadedAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      </Card>

      <Card elevation={1} style={{ padding: '15px' }}>
        <h3>
          <Icon icon="chat" />
          {' '}
          Комментарии
        </h3>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px',
        }}
        >
          {comments.map((c) => (
            <Card key={c.id} elevation={2} style={{ padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  alt="avatar"
                  src="https://placehold.co/40x40"
                  style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                />
                <div>
                  <p style={{ margin: 0 }}>
                    {typeof c.text === 'object'
                      ? c.text.comment ?? JSON.stringify(c.text)
                      : c.text}
                  </p>
                  <small style={{ color: '#5c7080' }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <InputGroup
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Напишите комментарий..."
          value={commentText}
        />
        <Button icon="send-message" intent="primary" onClick={handleAddComment} style={{ marginTop: '10px' }}>
          Добавить комментарий
        </Button>
      </Card>
    </div>
  );
};

export default TaskPage;
