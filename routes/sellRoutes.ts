import { Router } from "express";
import { sellController } from "../controller/sellController";

export class sellRoutes{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes();
    }

    private routes(){
        this.router.post('/create', (req, res) => sellController.sellCreate(req, res));
        this.router.get('/sales', (req, res) => sellController.getSell(req, res));
    }
}