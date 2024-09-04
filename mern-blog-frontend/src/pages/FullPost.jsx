import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import ReactMarkdown from 'react-markdown';

export const FullPost = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/posts/${id}`);
        console.log(data);
        setData(data);
      } catch (error) {
        console.log(error);
        alert('Проблемы с загрузкой статьи');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  const {
    _id,
    title,
    text,
    imageUrl,
    viewsCount,
    createdAt,
    updatedAt,
    tags,
    user,
  } = data;

  return (
    <>
      <Post
        id={_id}
        title={title}
        imageUrl={imageUrl}
        user={user}
        createdAt={createdAt}
        viewsCount={viewsCount}
        commentsCount={3}
        tags={tags}
        isFullPost
      >
        <ReactMarkdown children={text} />
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: 'Вася Пупкин',
              avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
            },
            text: 'Это тестовый комментарий 555555',
          },
          {
            user: {
              fullName: 'Иван Иванов',
              avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
            },
            text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
