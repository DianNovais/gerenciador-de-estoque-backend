import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

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
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        req.body.user = verify;
        next();
    } catch (error) {
        return res.status(401).json({"message": "Token inválido", error});
    }
    
}