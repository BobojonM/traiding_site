import userService from "../services/user-service.mjs";


class UserController{
    async registerUser(req, res, next){
        try{
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        }catch(e){
            console.log(e);
        }
    }

    async loginUser(req, res, next){
        try{

        }catch(e){
            
        }
    }

    async logoutUser(req, res, next){
        try{

        }catch(e){
            
        }
    }

    async activateUser(req, res, next){
        try{

        }catch(e){
            
        }
    }

    async refreshUser(req, res, next){
        try{

        }catch(e){
            
        }
    }

    async getUsers(req, res, next){
        try{
            res.json(['123', 'test']);
        }catch(e){
            res.json(e);
        }
    }
}

export default new UserController();