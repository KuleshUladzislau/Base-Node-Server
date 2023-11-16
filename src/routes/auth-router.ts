import {Router} from 'express'
import {Response, Request} from "express";
import {authRepository} from "../repositories/auth-respository";
import {check, validationResult} from 'express-validator';
import {tokenService} from "../services/token-service";
import {authMiddleware} from "../midlewares/authMiddleware";


export const authRouter = Router({})


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

            if (registrationInfo.user) {
                res.cookie('refreshToken', registrationInfo.token.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                });
                return res.status(200).json(registrationInfo);
            } else {
                return res.status(400).json({ message: 'A user with this email already exists' });
            }



            if (registrationInfo) return res.status(200).json(registrationInfo)
        } catch (e) {
            res.status(500).json({message: 'Registration error'})
        }

    })
authRouter.post('/login', async (req: Request, res: Response) => {

    try {
        const {email, password} = req.body
        const checkUserInDB = await authRepository.login(email, password)

        if (!checkUserInDB) return res.status(400).json({message: 'User not found'})

        if (checkUserInDB.status === 400) return res.status(400).json({message: checkUserInDB.message})


        if (checkUserInDB.status === 200) {
            res.cookie('refreshToken', checkUserInDB?.token?.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })
            res.cookie('accessToken', checkUserInDB?.token?.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            })

            return res.status(200).json(checkUserInDB)
        }

    } catch (e) {

    }

})

authRouter.post('/logout', async (req: Request, res: Response) => {

    try {
        const {refreshToken} = req.cookies
        const token = await authRepository.logout(refreshToken)
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return res.status(200).json(token)
    } catch (e) {

    }

})

authRouter.get('/refresh', async (req: Request, res: Response) => {

    try {
        const {refreshToken} = req.cookies
        const userData = await authRepository.refreshToken(refreshToken)
        res.cookie('refreshToken', userData?.tokens?.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.cookie('accessToken', userData?.tokens?.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        return res.status(203).json(userData)


    } catch (e) {
        return res.status(401).json({message: "Unauthorized user"})
    }

})

authRouter.get('/me', async (req: Request, res: Response) => {

    try {
        const {refreshToken} = req.cookies
        const userData = await authRepository.me(refreshToken)

        if (userData) return res.status(200).json(userData)
        if (!userData) return res.status(401).send('unauthorized user')
    } catch (e) {
        console.log(e)
    }

})




