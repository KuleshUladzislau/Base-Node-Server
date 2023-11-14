import {Router} from "express";
import {Response,Request} from "express";
 import {productRepository} from "../repositories/products-repository";
import {authMiddleware} from "../midlewares/authMiddleware";
import {upload} from '../midlewares/upload'
import {ObjectId} from "mongodb";

export const productRouter = Router({})



productRouter.get('/',[
    authMiddleware
],async (req:Request,res:Response)=>{
    const products = await productRepository.getProducts()
    if(products){
        res.send(products)
        res.status(201)
    }else{
        res.status(404)
    }
})

productRouter.post('/',upload.single('image'),async (req: Request & { file?: Express.Multer.File } ,res:Response)=>{

    let {title,price} =  req.body
    let patch = req.file?.path.slice(4)




    const createdProduct = await  productRepository.createProducts(title,price,patch,new ObjectId('65532421967ea34dfaa08367'))

    if(createdProduct){
        res.send(createdProduct)
        res.status(201)
    }else {
        res.status(404)
    }

})

productRouter.put('/',async (req:Request,res:Response)=>{

    let {id,title} =  req.body

    let updatedProduct  = await productRepository.updateProduct(id,title)

    if(updatedProduct){
        res.send(updatedProduct)
        res.status(201)
    }else {
        res.status(404)
    }

})

productRouter.delete('/',[
    authMiddleware
],async (req:Request,res:Response)=>{

    let {id} =  req.body

    let deletedProduct  = await productRepository.deleteProduct(id)

    if(deletedProduct){
        res.send(deletedProduct)
        res.status(201)
    }else {
        res.status(404)
    }

})

productRouter.post('/image',upload.single('avatar'),async (req:Request,res:Response)=>{

})
