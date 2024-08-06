import * as express from "express";
import { JwtPayload } from "jsonwebtoken";

interface Iuser{
  user_id?: string;
  user: string;
  iat: number;
  exp: number;
}

declare global {
    namespace Express {
        export interface Request {
          user?: Iuser | JwtPayload | undefined ;
        }
      }      
}
