import userService from "../services/user-service.mjs";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-errors.mjs";


class UserController{
    async registerUser(req, res, next){
        try{
            const errors = validationResult(req);
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
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Validation Error', errors.array()));
            }
            const {email, password} = req.body;
            const userData = await userService.loginUser(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }

    async logoutUser(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logoutUser(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
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
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }

    async getUsers(req, res, next){
        try{
            const users = await userService.getUsers();
            return res.json(users);
        }catch(e){
            next(e);
        }
    }
}

export default new UserController();