
import notificationModel from '../../database/models/notificationModel.js';
import * as factorHandler from '../Handler/factorHandler.js'
import catchAsyncError from '../utils/catchAsyncError.js';

const getAllNotifications = factorHandler.getAllDocuments(notificationModel, "notifications");

const getOneNotification = factorHandler.getOne(notificationModel, "notification");

const deleteNotification = factorHandler.deleteOne(notificationModel, "notification");

const updateNotification = factorHandler.updateOne(notificationModel, "notification");

const getUnreadNotificationsRestaurant = catchAsyncError(async (req, res, next) => {
    const notifications = await notificationModel.find({
        restaurant: req.params.restaurantId,
        read: false
    }).sort({ createdAt: -1 });
    res.status(200).json({ 
        status:'success',
        message: 'Unread notifications found successfully',
        data: notifications
    });
})

export { getAllNotifications, getOneNotification, deleteNotification, updateNotification ,getUnreadNotificationsRestaurant}



