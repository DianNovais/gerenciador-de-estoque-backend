import express, { Router, urlencoded } from "express";
import { Request, Response } from "express";
import cors from 'cors';
import { productRoutes } from "../routes/productRoutes";
import { userRoutes } from "../routes/userRoutes";
import { tokenVerify } from "../helpers/tokenVerify";
import { rateLimit } from 'express-rate-limit'
import { cartRoutes } from "../routes/cartRoutes";
import { sellRoutes } from "../routes/sellRoutes";

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	limit: 40,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})

export class App {
    public server : express.Application
    constructor(){
        this.server = express();
        this.serverRateLimit();
        this.corsConfig();
        this.serverConfig()
        this.routes();
    }
    private serverRateLimit(){
        this.server.use(limiter);
    }
    private corsConfig(){
        this.server.use(cors({
            origin: (origin, callback) => {
                if(origin !== 'http://localhost:5173'){
                    callback(new Error('Error de Cors'))
                }else(
                    callback(null, true)
                )
            },
            optionsSuccessStatus: 200,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: ['Content-Type', 'Authorization']
        }))
    }

    private serverConfig(){
        this.server.use(urlencoded({extended: true}));
        this.server.use(express.json());
        console.log('configurado');
        this.server.listen(3000, (): void => {
            console.log('conectado na porta 3000');
        })
    }

    private routes(){
        this.server.use('/product/', tokenVerify, new productRoutes().router);
        this.server.use('/user/', new userRoutes().router);
        this.server.use('/cart/', tokenVerify, new cartRoutes().router);
        this.server.use('/sell/', tokenVerify, new sellRoutes().router);

        this.server.get('/', (req: Request, res: Response) => {
            console.log('a porta está ativa')
            res.json({"Message": "Porta funcinando corretamente"});
        });
    }
}