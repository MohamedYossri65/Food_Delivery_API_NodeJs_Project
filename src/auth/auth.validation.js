import Joi from "joi"


const updateMeSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
    ,
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    ,
    phone: Joi.string().length(11)
    ,
    address: Joi.string().length(40)
})


export{updateMeSchema}