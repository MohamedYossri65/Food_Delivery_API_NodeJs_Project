
import notificationModel from '../../database/models/notificationModel.js';

import { Server } from 'socket.io';
import { createServer } from 'http';
import userModel from '../../database/models/userModel.js';

const initSocket = (app) => {

    let server = createServer(app);
    const io = new Server(server, { cors: "*" });
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Listen for order submissions
        socket.on('orderSubmitted', async (order) => {
            // Notify the admin
            const restaurantFound = await userModel.findById(order.items[0].restaurant);
            if (restaurantFound) {
                const notification = await notificationModel.find({
                    $and: [
                        { reciever: restaurantFound._id },
                        { isRead: { $ne: true } }
                    ]
                }).sort({ createdAt: -1 });

                io.emit(restaurantFound._id.toString(), notification);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    return server;
}

export default initSocket;