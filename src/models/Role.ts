import { Schema, model, Document } from 'mongoose';

interface Role extends Document {
    value: string;

}

const RoleSchema = new Schema({
    value:{type:String,unique:true,default:'User'}
});

export const RoleModel = model<Role>('Role', RoleSchema);
