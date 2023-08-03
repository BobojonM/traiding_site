import ApiError from "../exceptions/api-errors.mjs";

const errorMiddleware = (err, req, res, next) => {
    console.log(err);

    if(err instanceof ApiError){
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }

    return res.status(500).json({message: 'Unknown server error'});
}

export default errorMiddleware;