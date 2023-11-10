import { Schema, model, Document } from 'mongoose';

interface Token extends Document {
    user: string;
    refreshToken:string

}

const TokenSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:'User'},
    refreshToken:{type:String,required:true}
});

export const TokenModule = model('Token', TokenSchema);
