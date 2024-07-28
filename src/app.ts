import express from 'express';
import cors from 'cors';
const app = express();

//parsers
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



export default app;