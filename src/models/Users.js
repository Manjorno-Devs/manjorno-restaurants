import mongoose from 'mongoose';

const Users = mongoose.model('Users', new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email:{
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
}));

export default Users;