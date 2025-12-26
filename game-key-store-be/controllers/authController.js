const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { signToken, createRandomPin } = require('../utils/authUtils');
const generateEmailTemplate = require('../utils/emailTemplates');
const passport = require('passport'); // Import Passport

// HÀM TIỆN ÍCH: GỬI TOKEN VỀ CHO CLIENT
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined; // Xóa mật khẩu khỏi output

    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};


// 1. ĐĂNG KÝ
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        let userToProcess;

        if (existingUser) {
            if (existingUser.isVerified) {
                return next(new AppError('Email này đã được sử dụng.', 400));
            }
            userToProcess = existingUser;
            userToProcess.name = name;
            userToProcess.password = password;
        } else {
            userToProcess = new User({ name, email, password });
        }

        const verificationPin = createRandomPin();
        userToProcess.verificationPin = verificationPin;
        userToProcess.pinExpires = Date.now() + 10 * 60 * 1000;

        await userToProcess.save();

        const htmlContent = generateEmailTemplate(
            'Xác thực tài khoản',
            `Cảm ơn bạn đã đăng ký tài khoản tại <span class="highlight">GameKey Store</span>.<br>Vui lòng sử dụng mã bên dưới để xác thực email của bạn:`,
            verificationPin
        );

        await sendEmail({
            email: userToProcess.email,
            subject: 'Xác thực tài khoản GameKey Store',
            html: htmlContent,
        });

        res.status(201).json({
            status: 'success',
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.',
        });
    } catch (error) {
        next(error);
    }
};


// 2. XÁC THỰC EMAIL
exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, pin } = req.body;
        const user = await User.findOne({
            email,
            verificationPin: pin,
            pinExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(new AppError('Mã PIN không hợp lệ hoặc đã hết hạn.', 400));
        }

        user.isVerified = true;
        user.verificationPin = undefined;
        user.pinExpires = undefined;
        await user.save();

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};


// 3. ĐĂNG NHẬP
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('Vui lòng cung cấp email và mật khẩu!', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Email hoặc mật khẩu không chính xác.', 401));
        }

        if (!user.isVerified) {
            return next(new AppError('Tài khoản chưa được xác thực.', 401));
        }

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// === HÀM MỚI CHO GOOGLE CALLBACK ===
// === HÀM GOOGLE CALLBACK (ĐÃ SỬA LẠI) ===
exports.googleCallback = (req, res) => {
    // Passport đã xác thực user và gắn vào req.user
    if (!req.user) {
        // Nếu thất bại, chuyển hướng về trang login của frontend với thông báo lỗi
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }

    // 1. Tạo JWT
    const token = signToken(req.user._id);

    // 2. Chuyển hướng về trang callback của frontend, GỬI TOKEN QUA URL
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};
// ===================================
// 4. QUÊN MẬT KHẨU (YÊU CẦU PIN)
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError('Không tìm thấy người dùng với email này.', 404));
        }

        const resetPin = createRandomPin();
        user.verificationPin = resetPin;
        user.pinExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const htmlContent = generateEmailTemplate(
            'Đặt lại mật khẩu',
            `Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.<br>Sử dụng mã PIN bên dưới để tiến hành đặt lại mật khẩu:`,
            resetPin
        );
        await sendEmail({ email: user.email, subject: 'Yêu cầu đặt lại mật khẩu - GameKey Store', html: htmlContent });

        res.status(200).json({ status: 'success', message: 'Mã PIN đã được gửi tới email của bạn!' });
    } catch (error) {
        next(error);
    }
};


// 5. XÁC THỰC PIN (CHO QUÊN MẬT KHẨU)
exports.verifyPin = async (req, res, next) => {
    try {
        const { email, pin } = req.body;
        const user = await User.findOne({ email, verificationPin: pin, pinExpires: { $gt: Date.now() } });
        if (!user) {
            return next(new AppError('Mã PIN không hợp lệ hoặc đã hết hạn.', 400));
        }
        res.status(200).json({ status: 'success', message: 'Xác thực mã PIN thành công.' });
    } catch (error) {
        next(error);
    }
}


// 6. ĐẶT LẠI MẬT KHẨU MỚI
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, pin, password } = req.body;
        const user = await User.findOne({ email, verificationPin: pin, pinExpires: { $gt: Date.now() } });
        if (!user) {
            return next(new AppError('Mã PIN không hợp lệ hoặc đã hết hạn.', 400));
        }

        user.password = password;
        user.verificationPin = undefined;
        user.pinExpires = undefined;
        await user.save();

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};


// 7. ĐỔI MẬT KHẨU (KHI ĐÃ ĐĂNG NHẬP)
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        const { currentPassword, newPassword } = req.body;

        if (!(await user.comparePassword(currentPassword))) {
            return next(new AppError('Mật khẩu hiện tại không chính xác.', 401));
        }

        user.password = newPassword;
        await user.save();

        createSendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};
exports.resendVerificationPin = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new AppError('Vui lòng cung cấp email.', 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('Không tìm thấy người dùng với email này.', 404));
        }

        if (user.isVerified) {
            return next(new AppError('Tài khoản này đã được xác thực.', 400));
        }

        // Tạo mã PIN mới và lưu lại
        const verificationPin = createRandomPin();
        user.verificationPin = verificationPin;
        user.pinExpires = Date.now() + 10 * 60 * 1000; // 10 phút
        await user.save();

        // Gửi lại email
        const htmlContent = generateEmailTemplate(
            'Mã xác thực mới',
            `Bạn đã yêu cầu gửi lại mã xác thực.<br>Đây là mã PIN mới của bạn:`,
            verificationPin
        );
        await sendEmail({
            email: user.email,
            subject: 'Mã xác thực mới - GameKey Store',
            html: htmlContent,
        });

        res.status(200).json({
            status: 'success',
            message: 'Một mã PIN mới đã được gửi tới email của bạn!',
        });
    } catch (error) {
        next(error);
    }
};