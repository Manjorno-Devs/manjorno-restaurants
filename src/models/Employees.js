import mongoose from 'mongoose';

const Employees = mongoose.model('Employees', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    restaurantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Restaurants'
    },
    position: {
        type: String,
        enum: ['worker', 'manager', 'owner'],
        required: true,
    },
    dateTimeAdded: {
        type: Date,
        default: new Date()
    },
    HiredBy:{
        type: mongoose.Types.ObjectId,
        ref: 'Employees'
    },
    workingHere: {
        type: Boolean,
        default: true
    }
}));

export default Employees;