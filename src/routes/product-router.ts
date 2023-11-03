import {Router} from "express";
import {Response,Request} from "express";
import {productRepository} from "../repositories/example-repository";


export const productRouter = Router({})

productRouter.get('/',async (req:Request,res:Response)=>{
    const products = await productRepository.getProducts()
    if(products){
        res.send(products)
        res.status(201)
    }else{
        res.status(404)
    }
})

productRouter.post('/',async (req:Request,res:Response)=>{

    let {title,price} =  req.body

    const createdProduct = await  productRepository.createProducts(title,price)

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

productRouter.delete('/',async (req:Request,res:Response)=>{

    let {id} =  req.body

    let deletedProduct  = await productRepository.deleteProduct(id)

    if(deletedProduct){
        res.send(deletedProduct)
        res.status(201)
    }else {
        res.status(404)
    }

})
