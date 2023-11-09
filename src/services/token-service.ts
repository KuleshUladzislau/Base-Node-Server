import {ObjectId} from "mongodb";

type PayloadType = {
    id: ObjectId
    roles: string | string[]
}


const tokenService = {

    generateTokens(payload:PayloadType){

    }

}
