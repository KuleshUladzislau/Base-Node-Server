import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken'
import {config} from '../config'


interface CustomRequest extends Request {
    user?: string | jwt.JwtPayload
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {

        next();
    } else {

        try {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token) {
                return res.status(401).json({error: "user is not authorized"});
            }
            const decodedData = jwt.verify(token,config.secret)
            req.user = decodedData
            next()

        } catch (e) {
            console.log(e);
            return res.status(401).json({error: "user is not authorized"});
        }
    }
};
