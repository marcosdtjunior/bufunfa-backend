import './env';
import express, { json } from 'express';
import router from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(json());
app.use(router);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor local na porta ${PORT}`));
}

export default app;
