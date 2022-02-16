import mongoose from 'mongoose';

export default Restaurants = mongoose.Model('Restaurants', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pictures: {
        type: Array,
        default: new Array() 
    },
    description: {
        type: String
    },
    price: {
        type: Object,
        default: new Array()
    }
}));