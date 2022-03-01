import mongoose from 'mongoose';

const Employees = mongoose.model('Employees', new mongoose.Schema({
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
        enum: ['deliverer', 'worker', 'manager', 'owner'],
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

export default Employees;