import mongoose from 'mongoose';

const Restaurant = mongoose.model('Restaurants', new mongoose.Schema({
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
        type: Array,
        default: new Array()
    }
}));

export default Restaurant;