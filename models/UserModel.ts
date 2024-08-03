import Password from "antd/es/input/Password";
import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
    _id: string;
    user: string;
    password: string;
}

const UserModel = new Schema<IUser>({
    user: {type: String, require: true, unique: true},
    password: {type: String, require: true}
}, {timestamps: true});

const User = mongoose.model<IUser>('user', UserModel);

export default User;