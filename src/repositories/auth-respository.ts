import {UserModel} from '../models/User'
import {MongoClient, ObjectId} from "mongodb";
import bcrypt from 'bcryptjs'
import {tokenService} from "../services/token-service";



const mongoUri = "mongodb+srv://vercel-admin-user:paradoxkulesh@test.mi4rsi6.mongodb.net/?retryWrites=true&w=majority";


const authClient = new MongoClient(mongoUri).db('productsDB').collection('roles')

export type RegistrationInfo = {
    token:TokenType
    user:any
}
type TokenType = {
    accessToken:string
    refreshToken:string
}

export const authRepository = {
    async registration(email: string, password: string):Promise<RegistrationInfo> {
        const candidate = await authClient.findOne({email: email})

        if (candidate) {
            return {} as RegistrationInfo
        }
        const hashPassword = bcrypt.hashSync(password, 7);

        const user = new UserModel({
            userName: email,
            password: hashPassword,
            email:email,
            roles: ['User']
        })
        const token = tokenService.generateTokens(user._id,user.roles)
        await tokenService.saveToken(user._id,token.refreshToken)

        await authClient.insertOne(user)
        return {
           token: {...token},
            user
        }

    },

    async login(email: string, password: string) {
        const user = await authClient.findOne({email})
        if (!user) return false

        const validPassword = bcrypt.compareSync(password, user.password)

        if (!validPassword) return {status: 400, message: 'invalid password'}

        const tokens = tokenService.generateTokens(user._id,user.roles)
        await tokenService.saveToken(user._id,tokens.refreshToken)

        if (validPassword) return {status: 200,token:{...tokens},user}



    },

    async logout(refreshToken:string){
        await tokenService.removeToken(refreshToken)
        return {message:"All is okay"}
    },
    async refreshToken(refreshToken:string){
        if(!refreshToken){
            throw new Error('Unauthorized user')
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB){
            return {message:'Unauthorized user'}
        }
        const user = await authClient.findOne({_id:new ObjectId(userData?.id)})

        if(user){
            const tokens = tokenService.generateTokens(user._id,user.roles)
            await tokenService.saveToken(user._id,tokens.refreshToken)
            return {user,tokens}
        }
    },

}


