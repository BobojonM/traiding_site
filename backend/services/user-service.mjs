import userModel from "../models/user-model.mjs";
import mailService from "./mail-service.mjs";
import tokenService from "./token-service.mjs";
import UserDto from "../dtos/user-dto.mjs";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

class UserService {
    async registration(email, password) {
        const candidate = await userModel.findOne({ email });
        if (candidate) {
            throw new Error(`User ${email} already exists`);
        }
        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid();
        const user = await userModel.create({ email, password: hashedPassword, activationLink });
        await mailService.sendActivation(email, activationLink);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }
}

export default new UserService();
