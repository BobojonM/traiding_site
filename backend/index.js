import dotenv from 'dotenv';
import express from 'express';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connect } from 'mongoose';
import router from './router/index.mjs';


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

const start = async () => {
    try {
        await connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log('Server is running on port ' + PORT));
    } catch (e) {
        console.log(e);
    }
};

start();
