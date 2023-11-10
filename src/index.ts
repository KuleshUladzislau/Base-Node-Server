import express,{Request,Response} from 'express'
import {run} from "./repositories/db";
import {productRouter} from "./routes/product-router";
import {authRouter} from "./routes/auth-router";
import cookieParser from 'cookie-parser'
import cors from 'cors';



const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors({
    origin:['http://localhost:3001','http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true

}));
app.use(cookieParser())

app.use(express.json());





const startApp = async ()=>{
    await run()
    app.listen(PORT, () => {
        console.log(`API listening on PORT ${PORT} `)
    })
    app.get('/', (req:Request, res:Response) => {
    res.send('Hey this is my API    🥳')});

}

startApp()







app.use('/products',productRouter)
app.use('/auth',authRouter)


