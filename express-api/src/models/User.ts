import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('user', UserSchema) 