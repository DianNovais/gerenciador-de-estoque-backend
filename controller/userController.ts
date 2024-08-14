import { Request, Response } from "express";
import { userMiddle } from "../middleware/userMiddle";
import bcrypt from 'bcrypt';
import User from "../models/UserModel";
import createToken from "../helpers/tokenCreate";
import { logger } from "../logs/logConfig";


export class userController{
    public static async userRegister(req: Request, res: Response){
        const {user, password} = req.body;
        const isValid = await userMiddle.verifyUser(req);

        if(isValid !== true){
            return res.status(400).json({"message": isValid})
        }

        const salt: string = await bcrypt.genSalt(10);
        const hash: string = await bcrypt.hash(password, salt);

        const userCreated = new User({
            user: user,
            password: hash
        })

        try {
            await userCreated.save();

            logger.info(`foi criado um novo usuário ${userCreated.user}`);
            return res.status(200).json({userCreated});

        } catch (error) {
            logger.debug(`server error: ${error}`);
            return res.status(400).json({error});
        }
    }
    public static async userLogin(req: Request, res: Response){
            const {user, password} = req.body;
            
            try {
                if(!user || !password){
                    return res.status(400).json({"message": "não deixe campos em branco"});
                }
    
                const userExist = await User.findOne({user: user});
    
                if(!userExist){
                    return res.status(404).json({"message": "Usúario não encontrado"});
                }
                
                if(!userExist.password){
                    return res.status(500).json({"message": "Error server"})
                }

                const validPass = await bcrypt.compare(password, userExist.password);

                if(!validPass){
                    return res.status(400).json({"message": "Senha inválida"});
                }

                const token = createToken(userExist);

                logger.info(`user ${user} logado.`);
                return res.status(200).json({token: token});
            } catch (error) {
                console.log(error);
                return res.status(500).json({"message": "server error", error})
            }
            

            

    }
}