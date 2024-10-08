import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchRegister, selectAuth } from '../../redux/slices/auth';
import styles from './Login.module.scss';

export const Registration = () => {
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
      fullName: 'Вася Пупкин',
      email: 'mez@mail.ru',
      password: '123456',
    },
  });

  const onSubmit = async (data) => {
    const { payload } = await dispatch(fetchRegister(data));
    if (!payload) {
      return alert('Не удалось зарегестрироваться');
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
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label='Полное имя'
          fullWidth
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Укажите полное имя' })}
        />
        <TextField
          className={styles.field}
          label='E-Mail'
          fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите почту' })}
        />
        <TextField
          className={styles.field}
          label='Пароль'
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите пароль' })}
        />
        <Button
          disabled={!isValid}
          type='submit'
          size='large'
          variant='contained'
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
