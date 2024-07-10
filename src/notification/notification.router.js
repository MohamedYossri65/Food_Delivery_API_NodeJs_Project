import express from 'express';
import * as notificationcontroller from './notification.controller.js';
import { allowedTo, protectedRouts } from '../auth/auth.controller.js';

const notificationRouter = express.Router();

notificationRouter.route('/')
    .get(notificationcontroller.getAllNotifications);

notificationRouter.get('/restaurant-unread-notifications',
    notificationcontroller.getUnreadNotificationsRestaurant)

notificationRouter.route('/:id')
    .get(notificationcontroller.getOneNotification)
    .delete(protectedRouts, allowedTo('admin'), notificationcontroller.deleteNotification)
    .patch(protectedRouts, allowedTo('resturant'),
        notificationcontroller.updateNotification);

export default notificationRouter;
