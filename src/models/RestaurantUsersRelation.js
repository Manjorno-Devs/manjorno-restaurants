import mongoose from 'mongoose';

export default RestaurantUsers = mongoose.model('RestaurantUserRelation', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: mongoose.ObjectId,
        ref: 'Restaurants'
    },
    username: {
        type: String,
        required: true
    },
    position: {
        type: String,
        enum: ['employee', 'manager'],
        required: true,
    },
    dateTimeAdded: {
        type: Date,
        default: new Date()
    },
    workingHere: {
        type: Boolean,
        default: true
    }
}));