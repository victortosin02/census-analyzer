export const responseHandler = (
    res,
    message,
    statusCode,
    success = false,
    data = {}
) => {
    res.status(statusCode).json({
        success,
        message,
        data,
    });
};