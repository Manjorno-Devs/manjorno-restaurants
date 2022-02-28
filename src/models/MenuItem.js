import mongoose from 'mongoose';

const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({
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
    },
    restaurantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Restaurant'
    }
}));

export default MenuItem;