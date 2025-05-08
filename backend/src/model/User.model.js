import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    securityQuestion: { type: String, required: true },
    securityAnswer: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpire: { type: Date }
});

// Sebelum menyimpan user, kita hash jawaban keamanan
userSchema.pre('save', async function(next) {
    if (this.isModified('securityAnswer')) {
        this.securityAnswer = await bcrypt.hash(this.securityAnswer, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);
export { User };
