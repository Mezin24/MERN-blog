import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import { selectAuth } from '../../redux/slices/auth';
import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams();
  const isAuth = useSelector(selectAuth);
  const [imageUrl, setImageUrl] = React.useState('');
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const inputRef = React.useRef(null);
  const navigate = useNavigate();
  const isEditing = id;

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.set('image', file);
      const { data } = await axios.post('/upload', formData);
      console.log(data);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('Не удалось загрузить фаил');
    }
    console.log(e.target.files);
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        text,
        imageUrl,
        tags,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);
      const postId = isEditing ? id : data._id;
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.warn(error);
      alert('Не удалось загрузить статью');
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn(err);
          alert('Возникли проблеммы с загрузкой статьи');
        });
    }
  }, []);

  if (!isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputRef.current.click()}
        variant='outlined'
        size='large'
      >
        Загрузить превью
      </Button>
      <input ref={inputRef} type='file' onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button
            variant='contained'
            color='error'
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt='Uploaded'
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant='standard'
        placeholder='Заголовок статьи...'
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant='standard'
        placeholder='Тэги'
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        {isEditing ? (
          <Button onClick={onSubmit} size='large' variant='contained'>
            Сохранить
          </Button>
        ) : (
          <Button onClick={onSubmit} size='large' variant='contained'>
            Опубликовать
          </Button>
        )}
        <a href='/'>
          <Button size='large'>Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
