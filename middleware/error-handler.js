const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong, Please try again later',
	}

	// validation error
	if (err.name === 'ValidationError') {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(',')
		customError.statusCode = StatusCodes.BAD_REQUEST
	}

	// handling duplicate email error message
	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate field value entered for ${Object.keys(
			err.keyValue
		)} field, Please choose another value`
		customError.statusCode = StatusCodes.BAD_REQUEST
	}

	if (err.name === 'CastError') {
		customError.msg = `No item of id : ${err.value} found`
		customError.statusCode = StatusCodes.NOT_FOUND
	}

	return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
