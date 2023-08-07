import { IUser } from "./IUser";

export default interface RootState {
    toolkit: {
        user: IUser;
        isAuth: boolean;
        isLoading: boolean;
    };
}
