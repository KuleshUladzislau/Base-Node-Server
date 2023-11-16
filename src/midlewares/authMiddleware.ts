import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken'
import {config} from '../config'
import {tokenService} from "../services/token-service";


interface CustomRequest extends Request {
    user?: string | jwt.JwtPayload
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {


        try {

            const token = req.cookies['accessToken']

            if (!token) {
                return res.status(401).json({error: "user is not authorized"});
            }
            const userData = tokenService.validateAccessToken(token)
            if(!userData){
                return res.status(401).json({error: "user is not authorized"});
            }
            req.user = userData

            next()

        } catch (e) {
            console.log(e);
            return res.status(401).json({error: "user is not authorized"});
        }

};
