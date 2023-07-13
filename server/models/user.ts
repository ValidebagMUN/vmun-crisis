import mongoose from 'mongoose';
//@ts-expect-error
import bcrypt from 'mongoose-bcrypt';

const schema = new mongoose.Schema(
    {
        username: { type: String, unique: true},
        password: { type: String, bcrypt: true},
        side: String
    },
    { timestamps: true, strict: true }
);

schema.plugin(bcrypt);

export default mongoose.model('User', schema, 'user');