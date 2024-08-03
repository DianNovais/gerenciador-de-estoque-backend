import mongoose from "mongoose";

interface IMongoConnect{
    connectDb(): void;
}

export class MongoConnect implements IMongoConnect{
    public async connectDb(): Promise<void>{
        if(process.env.MONGO_URI){
            mongoose.connect(process.env.MONGO_URI).then(() => console.log('Conectado ao banco!')).catch((err) => {
                console.log(err, 'erro ao conectar ao banco');
                process.exit();
            });
            
        }else{
            console.log('Problema com a chave uri!');
            process.exit();
        }
    }
}
