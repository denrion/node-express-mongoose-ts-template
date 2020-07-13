import { Application } from 'express';
import { authRouter } from '../routes/authRoutes';
import { userRouter } from '../routes/userRoutes';

const setupRoutes = (app: Application) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
};

export default setupRoutes;
