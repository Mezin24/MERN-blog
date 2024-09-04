import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthData, selectAuth } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';

export const Login = () => {
  const isAuth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: 'mez@mail.ru',
      password: '123456',
    },
  });

  const onSubmit = async (data) => {
    const { payload } = await dispatch(fetchAuthData(data));
    if (!payload) {
      return alert('Не удалось авторизоваться');
    }
    if ('token' in payload) {
      localStorage.setItem('mern-blog-token', payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant='h5'>
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='E-Mail'
          helperText={errors.email?.message}
          error={Boolean(errors.email?.message)}
          fullWidth
          {...register('email', { required: 'Укажите почту' })}
        />
        <TextField
          className={styles.field}
          label='Пароль'
          helperText={errors.password?.message}
          error={Boolean(errors.password?.message)}
          fullWidth
          {...register('password', { required: 'Укажите пароль' })}
        />
        <Button
          disabled={!isValid}
          size='large'
          variant='contained'
          type='submit'
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
};
