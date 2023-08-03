import userService from "../services/user-service.mjs";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-errors.mjs";


class UserController{
    async registerUser(req, res, next){
        try{
            const errors = validationResult(req);
            console.log(errors.array());
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Validation Error', errors.array()));
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }

    async loginUser(req, res, next){
        try{

        }catch(e){
            next(e);
        }
    }

    async logoutUser(req, res, next){
        try{

        }catch(e){
            next(e);
        }
    }

    async activateUser(req, res, next){
        try{
            const link = req.params.link;
            await userService.activate(link);
            return res.redirect(process.env.CLIENT_URL);
        }catch(e){
            next(e);
        }
    }

    async refreshUser(req, res, next){
        try{

        }catch(e){
            next(e);
        }
    }

    async getUsers(req, res, next){
        try{
            res.json(['123', 'test']);
        }catch(e){
            next(e);
        }
    }
}

export default new UserController();