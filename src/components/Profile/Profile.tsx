import React from 'react';
import { Controller, useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button, Card, FormGroup, InputGroup,
} from '@blueprintjs/core';
import { skipToken } from '@reduxjs/toolkit/query';
import { useChangePasswordMutation, useGetUserProfileQuery } from 'api/userApi';
import type { PasswordFormValues } from 'types/auth';

import { useAppDispatch } from 'hooks';
import { clearToken } from 'store/slices/userSlice';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userId: string | undefined;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      userId = payload.sub;
    } catch {
      alert('Ошибка токена');
    }
  }

  const { data: user, isLoading } = useGetUserProfileQuery(userId ?? skipToken);
  const [changePassword] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  const handleLogout = () => {
    dispatch(clearToken());
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Done':
        return '✅';

      case 'In Progress':
        return '🔄';

      default:
        return '⏳';
    }
  };

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      await changePassword({
        userId: userId!,
        body: { oldPassword: values.oldPassword, newPassword: values.newPassword },
      }).unwrap();
      alert('Пароль изменён');
      reset();
    } catch {
      alert('Ошибка смены пароля');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <Card elevation={2} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            alt="avatar"
            src="https://placehold.co/60x60"
            style={{ borderRadius: '50%', width: 60, height: 60 }}
          />
          <h2>{user?.username}</h2>
          <Button icon="edit" onClick={() => alert('Редактирование профиля')} />
        </div>
        <p>
          📅 Дата регистрации:
          {' '}
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
        </p>

        <Button onClick={handleLogout}>Выйти</Button>
      </Card>

      <Card elevation={1} style={{ marginBottom: 20 }}>
        <p>
          📧 Email:
          @example@gmail.com
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup label="🔑 Смена пароля">
            <Controller
              control={control}
              name="oldPassword"
              render={({ field }) => (
                <InputGroup
                  {...field}
                  placeholder="Старый пароль"
                  type="password"
                />
              )}
              rules={{ required: 'Введите старый пароль' }}
            />
            {errors.oldPassword && <p style={{ color: 'red' }}>{errors.oldPassword.message}</p>}

            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <InputGroup
                  {...field}
                  placeholder="Новый пароль"
                  style={{ marginTop: 10 }}
                  type="password"
                />
              )}
              rules={{ required: 'Введите новый пароль' }}
            />
            {errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword.message}</p>}

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputGroup
                  {...field}
                  placeholder="Подтверждение"
                  style={{ marginTop: 10 }}
                  type="password"
                />
              )}
              rules={{
                required: 'Подтвердите пароль',
                validate: (value) => value === newPasswordValue || 'Пароли не совпадают',
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>
            )}

            <Button
              intent="primary"
              style={{ marginTop: 10 }}
              type="submit"
            >
              Сохранить
            </Button>
          </FormGroup>
        </form>
      </Card>

      <Card elevation={1}>
        <h3>📌 Назначенные задачи</h3>
        {user?.assignedTasks?.length ? (
          <ul>
            {user.assignedTasks.map((t) => (
              <li key={t.id}>
                {renderStatusIcon(t.status)}
                {' '}
                {t.title}
                {' '}
                (
                {t.project ?? 'Без проекта'}
                )
              </li>
            ))}
          </ul>
        ) : (
          <p>Задач пока нет</p>
        )}
      </Card>
    </div>
  );
};

export default Profile;
