import { User } from "../model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_RESET_SECRET = "SigmaResetToken";

export const Login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if (!username || !password) {
            return res.status(422).json({ message : "Harap masukan field" });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(404).json({ message : "Username atau password salah" });
        }

        const token = jwt.sign({ id: user._id }, "SigmaToken", {expiresIn : '1h'});
        res.status(200).json({
            message : "Berhasil login",
            token
        });
    } catch(error) {
        res.status(500).json({ message : `Server error on login because ${error}` });
    }
};