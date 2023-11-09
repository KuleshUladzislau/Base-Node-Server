import { Schema, model, Document } from 'mongoose';

interface User extends Document {
    userName: string;
    password: string;
    roles: string[];
}

const UserSchema = new Schema({
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }],
});

export const UserModel = model<User>('User', UserSchema);

