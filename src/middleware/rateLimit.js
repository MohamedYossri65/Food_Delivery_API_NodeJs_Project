import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: "we have recieved too many requsts from this ip..!!!! ,try again within 15 min"
})

//create a limiter for forgot password requests
export const forgotPasswordLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 3, // limit each IP to 3 forgot password requests per windowMs
	message: "Too many forgot password attempts. Please try again later.",
});


//create a limiter for login requests
export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 login requests per windowMs
	message: "Too many login attempts. Please try again later.",
});