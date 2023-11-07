import express,{Request,Response} from 'express'
import {run} from "./repositories/db";
import {productRouter} from "./routes/product-router";


const app = express();
const PORT = process.env.PORT || 9000;



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


