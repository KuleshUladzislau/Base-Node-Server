import {Router} from 'express'
import {Response, Request} from "express";
import {authRepository} from "../repositories/auth-respository";
import {check, validationResult} from 'express-validator';
import {tokenService} from "../services/token-service";


export const authRouter = Router({})


// authRouter.get('/me', async (req: Request, res: Response) => {
//     await authRepository.me()
//     res.send('server work')
// })
authRouter.post('/registration',
    [
        check('email', 'invalid email').isEmail(),
        check('password', 'password must be at least 4 characters').isLength({min: 4})
    ]
    , async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json({message: 'registration error', errors})

            const {email, password} = req.body


            const registrationInfo = await authRepository.registration(email, password)

            res.cookie('refreshToken',registrationInfo.token.refreshToken,{maxAge:30*24*60&60*1000,httpOnly:true})

            if (!registrationInfo) return res.status(400).json({message: 'A user with this name exists'})


            if (registrationInfo) return res.status(200).json(registrationInfo)
        } catch (e) {
            res.status(400).json({message: 'Registration error'})
        }

    })
authRouter.post('/login', async (req: Request, res: Response) => {

    try {
        const {email, password} = req.body
        const checkUserInDB = await authRepository.login(email,password)

        if(!checkUserInDB) return res.status(400).json({message:'User not found'})

        if(checkUserInDB.status === 400) return res.status(400).json(checkUserInDB.message)


        if(checkUserInDB.status === 200) {
            res.cookie('refreshToken',checkUserInDB?.token?.refreshToken,{maxAge:30*24*60&60*1000,httpOnly:true})
            return res.status(200).json(checkUserInDB)
        }

    } catch (e) {

    }

})

authRouter.post('/logout', async (req: Request, res: Response) => {

    try {
        const {refreshToken} = req.cookies
        const token = await authRepository.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.status(200).json(token)
    } catch (e) {

    }

})

authRouter.get('/refresh', async (req: Request, res: Response) => {

    try{
        const {refreshToken} = req.cookies
        const userData = await authRepository.refreshToken(refreshToken)
        res.cookie('refreshToken',userData?.tokens?.refreshToken,{maxAge:30*24*60&60*1000,httpOnly:true})
        return res.json(userData)


    }catch (e) {
        return res.status(401).json({message:"Unauthorized user"})
    }

})




