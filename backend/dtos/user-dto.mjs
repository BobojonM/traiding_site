class UserDto{
    id;
    email;
    isActivated;

    constructor(model){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}

export default UserDto;