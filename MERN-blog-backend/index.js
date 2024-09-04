import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  registerValidator,
  loginValidator,
  postCreateValidator,
} from './validations.js';

import { checkAuth, handleValidationError } from './utils/index.js';
import { PostController, UserController } from './controllers/index.js';

mongoose
  .connect('mongodb+srv://mezin24:wwwwww@cluster0.zzyi3.mongodb.net/blog')
  .then(() => console.log('Db connect'))
  .catch(() => console.log('Db error'));

const app = express();

const storage = multer.diskStorage({
  destination: (_, s, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.get('/auth/me', checkAuth, UserController.aboutMe);
app.post(
  '/auth/register',
  registerValidator,
  handleValidationError,
  UserController.register
);
app.post(
  '/auth/login',
  loginValidator,
  handleValidationError,
  UserController.login
);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidator, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidator, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Server works');
  }
});
