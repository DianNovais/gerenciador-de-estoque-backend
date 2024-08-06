import { Request, Response } from "express";
import Cart from "../models/CartModel";
import { logger } from "../logs/logConfig";
import mongoose, { mongo, Schema } from "mongoose";
import product from "../models/ProductModel";
import { ObjectId } from "mongodb";

export class cartController{
    public static async productAdd(req: Request, res: Response){
        if(!req.body){
            return res.status(400).json({"message": "Dados em branco body"});
        }

        if(!req.user){
            return res.status(400).json({"message": "falha ao verificar autenticação"});
        }

        const userId = req.user?.user_id;
        
        if(!userId){
            logger.error('userId não recebido productAdd');
            return res.status(401).json({"message": "usúario inválido"});
        }
        
        const cartExist = await Cart.findOne({user_id: userId});

        let cart;
        if(!cartExist){
            cart = await cartController.createCart(req, res);
        }else{
            cart = cartExist;
        }
        
        if(!cart){
            return
        }

        //add product in the cart
        const {products} = req.body;
        
        if(!products){
            return res.status(400).json({"message": "O carrinho precisa ter produtos"});
        }

        if(products.length < 1){
            return res.status(400).json({"message": "O carrinho precisa ter produtos"});
        }

        if(products.length > 20){
            return res.status(400).json({"message": "Seu carrinho está cheio"});
        }

        cart.products.splice(0, cart.products.length);

        for(let x = 0; x < products.length ; x++){
            const product_Id = products[x].product_id;
            const quantity = products[x].quantity;

            const typeProductId = typeof(product_Id);
            const typeQuantity = typeof(quantity);

            if( typeQuantity !== 'number' || typeProductId !== 'string'){
                return res.status(400).json({"message": "Lista de itens inválida"});
            }

            if(!ObjectId.isValid(product_Id)){
                return res.status(400).json({"message": "Produto inválido"});
            }

            const productFind = await product.findOne({_id: product_Id});

            if(!productFind){
                return res.status(404).json({"message": "Produto inválido"});
            }

            if(productFind.quantity < quantity){
                return res.status(400).json({"message": "Quantidade não disponivel do produto, verifique a quantidade em estoque do mesmo"});
            }

            const productQtd = parseInt(quantity);
            const productId = new mongoose.Types.ObjectId(`${product_Id}`);
            cart.products.push({product_id: productId, quantity: productQtd});
        }
        try {
            const newCart = await cart.save();
            return res.status(200).json({cart: newCart.products});
        } catch (error) {
            
        }
        
    }

    private static async createCart(req: Request, res: Response){
        const userId = req.user?.user_id;
        const userName = req.user?.user;

        if(!userId){
            logger.error('userId não recebido createCart');
            res.status(401).json({"message": "usúario inválido"});
            return ;
        }

        try {
            const cartCreated = new Cart({
                user_id: userId,
                products: []
            })

            await cartCreated.save();

            logger.info(`carrinho do ${userId + " " + userName} criado com sucesso`)
            return cartCreated;

        } catch (error) {
            logger.error(`ocorreu um error o carrinho do ${userId + " " + userName} criar um carrinho ${error}`)
            res.status(500).json({"message": "error no servidor"});
            return 
        }
        
    }

    public static async getCart(req: Request, res: Response){
        
        if(!req.user){
            return res.status(400).json({"message": "usuário inválido"});
        }

        if(typeof(req.user) !== 'object' && 'user_id' in req.user){
            return res.status(400).json({"message": "usuário inválido"});
        }


        const user_id = req.user?.user_id;

        const cartExist = await Cart.findOne({user_id: user_id});

        let cart;
        if(!cartExist){
            const cartCreated = await cartController.createCart(req, res);
            cart = cartCreated;
        }else{
            cart = cartExist;
        }

        if(!cart){
            return;
        }

        return res.status(200).json({cart : cart.products});
    }
}