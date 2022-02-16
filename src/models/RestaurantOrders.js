import mongoose from 'mongoose';

export default RestaurantOrders = mongoose.model('UserOrders', new mongoose.Schema({
    orderId:{
        type: mongoose.ObjectId,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    delivererId: {
        type: String, 
        required: true
    },
    restaurantId: {
        type: mongoose.ObjectId,
        ref: 'Restaurants'
    },
    restaurantName: {
        type: String,
        required: true
    },
    dateTimeOrdered: {
        type: DateTime,
        default: new DateTime()
    }
}));