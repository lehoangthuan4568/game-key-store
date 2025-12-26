// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback" // Phải khớp với URI trong Google Console
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // profile chứa thông tin user từ Google (profile.id, profile.displayName, profile.emails)
            const email = profile.emails[0].value;
            const googleId = profile.id;

            // 1. Tìm user bằng Google ID
            let user = await User.findOne({ googleId: googleId });

            if (user) {
                // Nếu tìm thấy, user đã đăng nhập
                return done(null, user);
            }

            // 2. Nếu không, tìm bằng email (để liên kết tài khoản)
            user = await User.findOne({ email: email });

            if (user) {
                // Đã có tài khoản (đăng ký bằng email thường), cập nhật googleId
                user.googleId = googleId;
                user.isVerified = true; // Email từ Google đã được xác thực
                await user.save();
                return done(null, user);
            }

            // 3. Nếu không có user nào, tạo tài khoản mới
            const newUser = await User.create({
                name: profile.displayName,
                email: email,
                googleId: googleId,
                isVerified: true // Tự động xác thực
            });

            return done(null, newUser);

        } catch (error) {
            return done(error, false);
        }
    }
));

// Không cần serialize/deserialize user vì chúng ta dùng JWT (session: false)