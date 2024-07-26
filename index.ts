import app from './core/app';
import dotenv from 'dotenv'
const PORT = process.env.PORT || 1000;
dotenv.config()
const server = app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
// const server = functions.https.onRequest(app)
// export default server