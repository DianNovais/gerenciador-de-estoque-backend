import dotenv from 'dotenv'
import {MongoConnect} from './db/connection';
import { App } from './server/App';

dotenv.config();

const mongoConnect = new MongoConnect;

mongoConnect.connectDb();

new App;