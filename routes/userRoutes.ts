import { Router } from "express";
import { userController } from "../controller/userController";


export class userRoutes{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes();
    }

    private routes(){
        this.router.post('/register', userController.userRegister);
        this.router.post('/login', userController.userLogin);
    }
}