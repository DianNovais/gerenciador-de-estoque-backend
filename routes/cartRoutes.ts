import { Router } from "express";
import { cartController } from "../controller/cartController";


export class cartRoutes{
    public router: Router;

    constructor(){
        this.router = Router();
        this.routes();
    }


    private routes(){
        this.router.post('/addproducts', cartController.productAdd);
        this.router.post('/delete', cartController.deleteProduct);
        this.router.get('/getproducts', cartController.getCart);
    }
}