import { Request, Response } from "express";
import Cart from "../models/CartModel";
import { logger } from "../logs/logConfig";
import mongoose, { mongo, Schema } from "mongoose";
import product from "../models/ProductModel";
import { ObjectId } from "mongodb";
import { message } from "antd";

export class cartController{
    public static async productAdd(req: Request, res: Response){
        if(!req.body){
            logger.error('um user está enviando o req.body vazio');
            return res.status(400).json({"message": "Dados em branco body"});
        }

        if(!req.user){
            logger.error('um user está enviando o req.user vazio');
            return res.status(400).json({"message": "falha ao verificar autenticação"});
        }

        const userId = req.user?.user_id;
        
        if(!userId){
            logger.error('userId não recebido - productAdd');
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
            logger.error(`o user ${userId + " " + req.user?.user} não envia produtos no carrinho`);
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
                logger.error(`o user ${userId + " " + req.user?.user} está enviando produtos inválidos`);
                return res.status(400).json({"message": "Lista de itens inválida"});
            }

            if(!ObjectId.isValid(product_Id)){
                logger.error(`o user ${userId + " " + req.user?.user} está enviando produtos inválidos`);
                return res.status(400).json({"message": "Produto inválido"});
            }

            const productFind = await product.findOne({_id: product_Id});

            if(!productFind){
                logger.error(`o user ${userId + " " + req.user?.user} está enviando produtos inválidos`);
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
            logger.info(`o user ${userId + " " + req.user?.user} ADICIONOU PRODUTOS`);
            return res.status(200).json({cart: newCart.products});
        } catch (error) {
            logger.debug(`server error: ${error}`);
            return res.status(500).json({"message": "server error"});
        }
        
    }


    public static async deleteProduct(req: Request, res: Response){
        if(!req.user){
            logger.error(`sem dados do user`);
            res.status(400).json({"message": "Falha ao verificar autenticação"});
        }
        
        const userId = req.user?.user_id;
        
        if(!userId){
            logger.error('userId não recebido');
            return res.status(401).json({"message": "usúario inválido"});
        }

        if(!req.body.productId){
            logger.error(`o user ${userId + " " + req.user?.user} não envia produto para deletar`);
            return res.status(400).json({"message": "não existe produto para deletar"})
        }

        if(!ObjectId.isValid(req.body.productId)){
            logger.error(`o user ${userId + " " + req.user?.user} enviou um produto com id inválido`);
            return res.status(400).json({"message": "produto inválido"});
        }

        const productId = new mongoose.Types.ObjectId(`${req.body.productId}`);

        try {
            const cartExist = await Cart.findOne({user_id: userId});

            if(!cartExist){
                logger.error(`o user ${userId + " " + req.user?.user} está tentando deletar um produto sem carrinho`);
                return res.status(404).json({"message": "carrinho não encontrado"});
            }

            // find index product
            const indexProduct = cartExist.products.findIndex(productItem => productItem.product_id?.toString() === productId.toString());
            console.log(productId, indexProduct);
            if(indexProduct === -1){
                logger.error(`o user ${userId + " " + req.user?.user} enviou um produto inexistente em seu carrinho`);
                return res.status(404).json({"message": "Produto não encontrado"});
            }

            cartExist.products.splice(indexProduct, 1);

            await cartExist.save();

            logger.info(`o user ${userId + " " + req.user?.user} deletou um produto`);
            return res.status(200).json({"message": "item foi deletado com sucesso", "deleted": true});

        } catch (error) {
            logger.debug(`server error: ${error}`);
            return res.status(500).json({"message": "server error"});
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
            logger.debug(`ocorreu um error o carrinho do ${userId + " " + userName} criar um carrinho ${error}`)
            res.status(500).json({"message": "error no servidor"});
            return 
        }
        
    }

    public static async getCart(req: Request, res: Response){
        
        if(!req.user){
            logger.error(`não foi fornecido as informações do user`);
            return res.status(400).json({"message": "usuário inválido"});
        }

        if(typeof(req.user) !== 'object' && 'user_id' in req.user){
            logger.error(`o cliente está tentando acessar o sistema com um user inválido`);
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

        let listProducts = [];
        for(let count = 0; count < cart.products.length; count++){
            try {
                const producFind = await product.findOne({_id: cart.products[count].product_id}).select('value');
                const newProduct = {
                    product_id: cart.products[count].product_id,
                    quantity: cart.products[count].quantity,
                    value: producFind?.value
                };

                listProducts.push(newProduct);
            } catch (error) {
                logger.debug(`server error: ${error}`);
            }
        }

        
        logger.info(`o user ${req.user?.user_id + " " + req.user?.user} requisitou todos produtos do carrinho`);
        return res.status(200).json({cart : listProducts});
    }
}