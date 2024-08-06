import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Iuser } from "../types/express";

export const tokenVerify = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.replace('Bearer', '').trim();

    if(!token){
        return res.status(401).json({"message": "acesso negado!"});
    }
    if(!process.env.SECRET_KEY){
        return res.status(500).json({"message": "server error token"})
    }

    try {
        const verify = jwt.verify(token, process.env.SECRET_KEY) as Iuser | JwtPayload;
        const payload = verify;
        if(verify){
            req.user = payload;
        }else{{
            return res.status(400).json({"message": "Algo deu errado na autenticação"});
        }}
        
        next();
    } catch (error) {
        return res.status(401).json({"message": "Token inválido", error});
    }
    
}