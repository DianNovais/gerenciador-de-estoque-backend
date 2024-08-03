import { Request } from "express";
import User from "../models/UserModel";


export class userMiddle{
    public static async verifyUser(req: Request): Promise<boolean | string>{
        const {user, password} = req.body;

        if(!user || !password){
            return "Não deixe campos em branco";
        }

        if(user.length < 4){
            return "O nome de usúario deve ter no minimo 4 carácter";
        }

        if(password.length < 6){
            return "A senha de usúario deve ter no minimo 6 carácter";
        }

        try {
            const userExist = await User.findOne({user: user});

            if(userExist){
                return "Você não pode usar esse nome de usuário";
            }
        } catch (error) {
            return `${error}`;
        }
        

        return true;
    }
}