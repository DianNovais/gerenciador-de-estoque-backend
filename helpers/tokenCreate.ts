import User, { IUser } from '../models/UserModel'
import jwt from 'jsonwebtoken';

type UserType = IUser;

const createToken = (userData: UserType) => {
    const payLoad = {
        user_id: userData._id,
        user: userData.user
    }
    if(process.env.SECRET_KEY){
            const token = jwt.sign(payLoad, process.env.SECRET_KEY, {expiresIn: '24h'});
            return token;
    }
    
}

export default createToken;