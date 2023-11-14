import { Schema, model, Document } from 'mongoose';



const ImageSchema = new Schema({
    image:{type:Schema.Types.ObjectId,ref:'User'},
    userId:{type:String,unique:true,required:true}
});

export const TokenModule = model('Image', ImageSchema);
