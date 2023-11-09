import {Router} from 'express'
import {Response, Request} from "express";
import {authRepository} from "../repositories/auth-respository";
import {check, validationResult} from 'express-validator';


export const authRouter = Router({})


authRouter.get('/me', async (req: Request, res: Response) => {
    await authRepository.me()
    res.send('server work')
})
authRouter.post('/registration',
    [
        check('userName', 'username cannot be empty').notEmpty(),
        check('password', 'password must be at least 4 characters').isLength({min: 4})
    ]
    , async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json({message: 'registration error', errors})

            const {userName, password} = req.body

            const registrationInfo = await authRepository.registration(userName, password)

            if (!registrationInfo) return res.status(400).json({message: 'A user with this name exists'})


            if (registrationInfo) return res.status(200).json({message: 'User is registered'})
        } catch (e) {
            res.status(400).json({message: 'Registration error'})
        }

    })
authRouter.post('/login', async (req: Request, res: Response) => {

    try {
        const {userName, password} = req.body
        const checkUserInDB = await authRepository.login(userName,password)

        if(!checkUserInDB) return res.status(400).json({message:'User not found'})

        if(checkUserInDB.status === 400) return res.status(400).json(checkUserInDB.message)


        if(checkUserInDB.status === 200) return res.status(200).json({token:checkUserInDB.token})




    } catch (e) {

    }

})




