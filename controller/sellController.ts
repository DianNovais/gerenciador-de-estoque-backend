import { Request, Response } from "express";
import { logger } from "../logs/logConfig";
import Cart from "../models/CartModel";
import Sell from "../models/sellModel";
import product from "../models/ProductModel";
import mongoose from "mongoose";

export class sellController {
  public static async sellCreate(req: Request, res: Response) {
    if (!req.body) {
      logger.error("um user está enviando o req.body vazio");
      return res.status(400).json({ message: "Dados em branco body" });
    }

    if (!req.user) {
      logger.error("um user está enviando o req.user vazio");
      return res
        .status(400)
        .json({ message: "falha ao verificar autenticação" });
    }

    const userId = req.user?.user_id;

    if (!userId) {
      logger.error("userId não recebido - sellCreate");
      return res.status(401).json({ message: "usúario inválido" });
    }

    const cartExist = await Cart.findOne({ user_id: userId });

    if (!cartExist || cartExist.products.length < 1) {
      return res
        .status(404)
        .json({ message: "adicione produtos ao carrinho!" });
    }

    try {
      const sellCount = await Sell.countDocuments();

      const newSell = new Sell();

      const mapCartIds = cartExist.products.map((p) => p.product_id);

      const allProducts = await product
        .find({ _id: { $in: mapCartIds } })
        .select("value name quantity");
      const mapProducts = new Map(
        allProducts.map((p) => [p._id.toString(), p])
      );

      let amount = 0;
      let bulkOperations = [];
      for (let product of mapProducts) {
        try {
          // search quantity product in the user cart
          const productCart = cartExist.products.filter((item) => {
            //compare id cart and id mapProducts
            if (item.product_id?.toString() === product[0]) {
              return item;
            }
          })[0];

          if (!productCart) {
            return res.status(404).json({ message: "Produto inválido" });
          }

          if (typeof productCart.quantity !== "number") {
            return res.status(400).json({ message: "quantidade inválida" });
          }

          if (productCart.quantity > product[1].quantity) {
            return res
              .status(400)
              .json({
                message:
                  "Quantidade não disponivel do produto, verifique a quantidade em estoque do mesmo",
              });
          }

          const newProduct = {
            productId: product[1]._id,
            quantity: productCart.quantity,
            value: product[1].value,
            name: product[1].name,
          };

          product[1].quantity -= productCart.quantity;

          amount += product[1].value * productCart.quantity;

          //match product to Cart and Orinal Product
          newSell.products.push(newProduct);

          // save operation bulk
          bulkOperations.push({
            updateOne: {
              filter: { _id: product[1]._id },
              update: { $inc: { quantity: -productCart.quantity } },
            },
          });
        } catch (error) {
          logger.debug(`server error: ${error}`);
        }
      }

      newSell.numberSell = sellCount;
      newSell.amount = amount;

      const sell = await newSell.save();

      cartExist.products = new mongoose.Types.DocumentArray([]);
      await cartExist.save();

      if (bulkOperations.length > 0) {
        await product.bulkWrite(bulkOperations);
      }

      return res.status(200).json(sell);
    } catch (error) {
      logger.error(`server error: ${error}`);
      return res.status(500).json({ message: "server error" });
    }
  }

  public static async getSell(req: Request, res: Response) {
    try {
      const sales = await Sell.find();

      if (!sales) {
        return res.status(404).json({ message: "ainda não há vendas" });
      }

      return res.status(200).json({ sales: sales });
    } catch (error) {
        logger.error(`server error: ${error}`);
        return res.status(500).json({ message: "server error" });
    }
  }
}
