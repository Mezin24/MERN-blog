import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get('/posts');

      if (!data) {
        thunkApi.rejectWithValue('Some fetch problems');
      }

      const tags = [...new Set(data.map((item) => item.tags).flat(1))];

      return { posts: data, tags };
    } catch (error) {
      thunkApi.rejectWithValue('Some fetch problems');
    }
  }
);

export const fetchRemovePost = createAsyncThunk(
  'posts/fetchRemovePost',
  async (id) => await axios.delete(`/posts/${id}`)
);

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state = initialState;
      })
      .addCase(fetchPosts.fulfilled, (state, { payload }) => {
        state.posts.items = payload.posts;
        state.tags.items = payload.tags;
        state.posts.status = 'success';
        state.tags.status = 'success';
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.status = 'error';
        state.tags.status = 'error';
        state.posts.items = [];
        state.tags.items = [];
      })
      .addCase(fetchRemovePost.pending, (state, payload) => {
        state.posts.items = state.posts.items.filter(
          (obj) => obj._id !== payload.meta.arg
        );
      });
  },
});

export const { actions: postsActions, reducer: postsReducer } = postsSlice;
