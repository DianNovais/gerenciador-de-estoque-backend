import { Router } from "express";
import { productController } from "../controller/productController";


export class productRoutes{
    public router: Router; 
    constructor(){
        this.router = Router();
        this.routes();
    }

    public routes(){
        this.router.post('/create', (req, res) => productController.productCreate(req, res));
        this.router.post('/delete', (req, res) => productController.productDelete(req, res));
        this.router.post('/modify', (req, res) => productController.modifyProduct(req, res));
        this.router.get('/allproducts', (req, res) => productController.allProducts(req, res));
    }
}