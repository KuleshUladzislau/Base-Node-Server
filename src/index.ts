import express,{Request,Response} from 'express'
import {productRouter} from "./routes/product-router";
import {runDB} from "./repositories/db";


const app = express();
const PORT = process.env.PORT || 5000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const startApp = async ()=>{
    await runDB()
    app.listen(PORT, () => {
        console.log(`API listening on PORT ${PORT} `)
    })
}

startApp()

app.get('/', (req:Request, res:Response) => {
    res.send('Hey this is my API    🥳');
});

app.post('/',async (req:Request,res:Response)=>{
    let title = await req.body.title
    res.send(title)
})




app.use('/products',productRouter)


