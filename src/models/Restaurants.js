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
    contacts: {
        type: Object,
        default: new Object()
    },
    locationLink:{
        type: String,
        required: true
    },
    menuItems: {
        type: Object,
        default: new Object()
    }
}));