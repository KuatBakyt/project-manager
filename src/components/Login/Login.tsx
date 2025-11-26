import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { useLoginMutation } from 'api/authApi';
import type { LoginForm } from 'types/auth';

import { useAppDispatch } from 'hooks';
import { setToken, setUser } from 'store/slices/userSlice';

const Login: React.FC = () => {
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { username: '', password: '' },
  });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values: LoginForm) => {
    try {
      const result = await login(values).unwrap();

      dispatch(setToken(result.token));
      localStorage.setItem('token', result.token);

      const payload = JSON.parse(atob(result.token.split('.')[1]));
      const userId = payload.sub;

      dispatch(setUser({ id: userId, username: values.username }));
      localStorage.setItem('userId', userId);

      navigate('/');
    } catch (err) {
      console.error('Ошибка входа', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '300px', margin: '50px auto' }}>
      <h2>🔐 Вход</h2>

      <FormGroup label="Логин" labelFor="username">
        <Controller
          control={control}
          name="username"
          render={({ field }) => <InputGroup id="username" {...field} />}
          rules={{ required: 'Введите логин' }}
        />
      </FormGroup>

      <FormGroup label="Пароль" labelFor="password">
        <Controller
          control={control}
          name="password"
          render={({ field }) => <InputGroup id="password" type="password" {...field} />}
          rules={{ required: 'Введите пароль' }}
        />
      </FormGroup>

      <Button intent="primary" loading={isLoading} type="submit">
        Войти
      </Button>
      <a href="/login" style={{ margin: '10px' }}>Забыли пароль?</a>

      {error && <p style={{ color: 'red' }}>Ошибка входа</p>}
    </form>
  );
};

export default Login;
