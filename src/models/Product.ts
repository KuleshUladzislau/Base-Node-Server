import { Schema, model, Document } from 'mongoose';

const CommentSchema = new Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    userName:{type:String,required:true,unique: true}
});

const ProductSchema = new Schema({
    image:{type:String,required: true},
    userId:{type:String,unique:true,required:true},
    title:{type:String,required:true},
    price:{type:String,required:true},
    comments:[CommentSchema]

});

export const ProductModule = model('Product', ProductSchema);
