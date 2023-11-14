import {File} from "buffer";

const patch = require('path')
const multer = require('multer')


const storage = multer.diskStorage({
    destination:function (req:Request,file:any,cb:any){
        cb(null,'src/images')
    },
    filename:function (req:Request,file:any,cb:any){
        let ext = patch.extname(file.originalname)
        cb(null,Date.now()+ext)
    },
})

export const upload = multer({
    storage:storage,
    fileFilter:function (req:Request,file:any,callback:any){
        if(
            file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'
        ){
            callback(null,true)
        }else {
            console.log('only jpg & png')
            callback(null,false)
        }

    },
    limits:{
        fileSize:3024*3024*2
    }
})



