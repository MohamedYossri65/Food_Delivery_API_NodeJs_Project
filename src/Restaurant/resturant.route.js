import express from 'express';
import * as resturantcontroller from './resturant.controller.js';

const resturantRouter = express.Router();


resturantRouter.route('/')
    .post(resturantcontroller.addResturant)
    .get(resturantcontroller.getAllResturants);   


resturantRouter.route('/:id')
    .get(resturantcontroller.getOneResturant)
    .delete(resturantcontroller.deleteOneResturant)
    .patch(resturantcontroller.updateOneResturant);

export default resturantRouter;
