import app from './core/app'
import { authMiddleware } from './middleware/authMiddleware';
import userRouter from "./routers/userRouter"
const PORT = process.env.PORT || 3000;
app.use(authMiddleware)
app.use("", userRouter)
const server = app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});