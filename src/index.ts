import express,{Request,Response} from 'express'

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `);
});
app.get('/', (req:Request, res:Response) => {
    res.send('Hey this is my API    🥳');
});
app.get('/about', (req:Request, res:Response) => {
    res.send('This is my about route..... ');
});
// Export the Express API
module.exports = app;
