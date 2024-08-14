import { Request, Response } from "express";
import { productMiddle } from "../middleware/productMiddle";
import product from "../models/ProductModel";
import { logger } from "../logs/logConfig";

interface IProductController {
  producCreate?(req: Request, res: Response): Response;
  productDelete?(req: Request, res: Response): Response;
  allProducts?(req: Request, res: Response): Response;
}

export class productController implements IProductController {
  public static async productCreate(req: Request, res: Response) {
    const { name, qtd, value } = req.body;

    const isValid: string | boolean = productMiddle.productVerify(
      name,
      qtd,
      value
    );

    if (isValid !== true) {
      logger.error(`o usúario ${req.body.user.user_id + " " + req.body.user.user} está tentando CRIAR um produto sem fornecer dados`)
      return res.status(400).json({ error: isValid });
    }

    const newProduct = new product({
      name,
      quantity: qtd,
      value,
    });

    try{
        await newProduct.save();
    }catch(error){
      logger.debug(`ocorreu um error ao CRIAR um produto ${error}`)
        return res.status(400).json({error});
    }
    
    logger.info(`o usúario ${req.body.user.user_id + " " + req.body.user.user} CRIOU o produto ${newProduct?.name}`);
    return res.status(200).json({newProduct});
  }

  public static async productDelete(req: Request, res: Response){
    const {_id} = req.body;

    if(!_id){
      logger.error(`o usúario ${req.body.user.user_id + " " + req.body.user.user} está tentando DELETAR um produto sem fornecer um _id`)
      return res.status(404).json({"error": "Não deixe campos em branco"})
    }

    try{
      const productFindAndDelete = await product.findOneAndDelete({_id: _id});
      if(!productFindAndDelete){
        logger.error(`o usúario ${req.body.user.user_id + " " + req.body.user.user} tentou DELETAR um produto inexistente`)
        return res.status(404).json({"message": "Produto não encontrado"});
      }

      logger.info(`o usúario ${req.body.user.user_id + " " + req.body.user.user} DELETOU o produto ${productFindAndDelete?.name}`);
      return res.status(200).json({"message": `${productFindAndDelete?.name} deletado`});
    }catch(error){
      console.log(error);
      logger.debug(`ocorreu um error ao DELETAR um produto ${error}`)
      return res.status(400).json({"message": "não foi possivel deletar o produto", error});
    }
    
  }

  public static async allProducts(req: Request, res: Response){
    try {
      const products = await product.find();
      logger.info(`o usúario ${req.user?.user_id + " " + req.user?.user} REQUISITOU todos produtos`);
      return res.status(200).json({products});

    } catch (error) {
      logger.debug(`ocorreu um error ao fazer a REQUIÇÃO de produtos ${error}`)
      return res.status(500).json({"message": "server error"});
    }
  }
  
}
