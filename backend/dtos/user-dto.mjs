class UserDto{
    id;
    email;
    isActivated;
    isAdmin;

    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.isAdmin = model.isAdmin;
    }
}

export default UserDto;