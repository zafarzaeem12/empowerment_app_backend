const User = require("../model/Users");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const cloudinary = require("../middleware/cloudinary");



const Complete_Profile  = async (req, res, next) => {
  const email = req.query.email;
  try {
  
    const find_email = await User.findOne({ email: email });

    const data = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async(error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            const db = moment(req.body.dob);
            const complete_profile = await User.updateOne(
              { _id: find_email._id },
              {
                $set: {
                  user_image: result.secure_url,
                  name: req.body.name,
                  dob: db.format("YYYY-MM-DD"),
                  gender: req.body.gender,
                  address: req.body.address,
                  state: req.body.state,
                  city: req.body.city,
                  role: req.body.role,
                  user_is_profile_complete: true,
                  is_verified: true,
                },
              },
              { new: true }
            );

            res.status(200).send({
              message: "Profile Completed Successfully",
            });
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

  } catch (err) {
    res.status(404).send({
      message: "Profile Not Completed",
    });
  }
};

const Register_New_User = async (req, res, next) => {
  const typed_Email = req.body.email;
  const typed_phone_number = req.body.phone_number;

  try {
    if (typed_Email) {
      const check_email = await User.findOne({ email: typed_Email });

      if (check_email) {
        return res.status(400).send({
          message: "This email is already registered.",
        });
      }
    }

    const newUser = {
      email: typed_Email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
      phone_number: typed_phone_number,
      user_device_token: req.body.user_device_token || "asdfghjkl",
      user_device_type: req.body.user_device_type || "android",
    };

    const Register = await User.create(newUser);

    const { _id, ...others } = Register;

    const num = Math.floor(Math.random() * 900000) + 100000;
    const nums = await User.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          verification_code: num,
        },
      },
      { new: true }
    );
    const { password, email, verification_code, ...othersfields } = nums;
    return res.status(201).send({
      message: "OTP sent for New user confirmation",
      status: 201,
      data: { verification_code, email },
    });
  } catch (err) {
    res.status(404).send({
      message: "OTP not created",
      status: 404,
    });
  }
};

const LoginRegisteredUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user_device_token = req.body.user_device_token || "asdfghjkl";
    const user_device_type = req.body.user_device_type || "android";

    const LoginUser = await User.findOne({
      email: email,
      user_device_token: user_device_token,
      user_device_type: user_device_type,
    });
    const gen_password = CryptoJS.AES.decrypt(
      LoginUser?.password,
      process.env.SECRET_KEY
    );
    const original_password = gen_password.toString(CryptoJS.enc.Utf8);

    if (email !== LoginUser?.email) {
      res.send({ message: "Email Not Matched" });
    } else if (password !== original_password) {
      res.send({ message: "Password Not Matched" });
    } else {
      if (LoginUser.role === "User" || LoginUser.role === "Admin") {
        const expiresIn = LoginUser.role === "User" ? "1h" : "23h";
        const token = jwt.sign(
          {
            id: LoginUser._id,
            role: LoginUser.role,
          },
          process.env.SECRET_KEY,
          { expiresIn }
        );

        const save_token = await User.findByIdAndUpdate(
          { _id: LoginUser?._id?.toString() },
          { $set: { user_authentication: `${token}` } },
          { new: true }
        );
        const { user_authentication } = save_token;

        res.send({
          message: "Login Successful",
          status: 200,
          data: { user_authentication },
        });
      } else {
        res.send({
          message: "Invalid role",
          status: 403,
        });
      }
    }
  } catch (err) {
    res.send({
      message: "Login Failed",
      status: 404,
    });
  }
};

const VerifyRegisteredUser = async (req, res) => {
  try {
    const Id = req.id;

    const verified_User = await User.findById(Id);
    const { password, ...details } = verified_User._doc;
    res.send({
      message: `${details?.name} Logged in Successfully`,
      status: 200,
      data: { ...details },
    });
  } catch (err) {
    res.send({
      message: "Login Failed!",
      status: 404,
    });
  }
};

const Update_Existing_User = async (req, res, next) => {
  const userAvator = req?.files?.user_image?.map((data) =>
    data?.path?.replace(/\\/g, "/")
  );
  const db = moment(req.body.dob, "YYYY-MM-DD").toDate();
  const Id = req.id;
  try {
    const Update_user = await User.findByIdAndUpdate(
      { _id: Id },
      {
        $set: {
          name: req.body.name,
          phone_number: req.body.phone_number,
          dob: db,
          user_image: userAvator,
          user_is_profile_complete: true,
        },
      },
      { new: true }
    );
    const { password, ...others } = Update_user._doc;

    res.send({
      message: `User Updated Successfully`,
      data: 204,
      data: others,
    });
  } catch (err) {
    res.send({
      message: `No User Updated`,
      status: 404,
    });
  }
};

const Delete_Existing_User_Permanently = async (req, res, next) => {
  const Id = req.id;
  try {
    const deleteUser = await User.deleteOne({ _id: Id });
    const { acknowledged, deletedCount } = deleteUser;

    if (acknowledged === true && deletedCount === 1) {
      res.send({
        message: "User Delete Successfully",
        status: 200,
      });
    } else {
      res.send({
        message: "User Not Delete",
        status: 200,
      });
    }
  } catch (err) {
    res.send({
      message: "User Not Found",
      status: 200,
    });
  }
};

const User_Forget_Password = async (req, res, next) => {
  try {
    const email = req.query.email;
    const userfind = await User.findOne({ email: email });
    if (userfind.email == null) {
      res.send({
        message: "Not OTP generated",
        code: 404,
      });
      next();
    } else if (userfind?.email) {
      const num = Math.floor(Math.random() * 900000) + 100000;
      const nums = await User.findOneAndUpdate(
        userfind?.email && userfind?._id,
        {
          $set: {
            verification_code: num,
            user_is_forgot: true,
          },
        },
        { new: true }
      );
      const { verification_code, email, ...others } = nums;
      res.send({
        message: "OTP generated",
        code: 201,
        data: { verification_code, email },
      });
    }
  } catch (err) {
    res.send({
      message: "Not Found OTP",
      code: 404,
    });
  }
};

const OTP_Verification = async (req, res, next) => {
  try {
    const typed_OTP = req.query.verification_code;
    const typed_email = req.query.email;
    const data = await User.findOne({ email: typed_email });
    if (typed_email == data?.email && typed_OTP == data?.verification_code) {
      const checked = await User.updateOne(
        { _id: data?._id },
        { is_verified: true },
        { new: true }
      );
      const { acknowledged, modifiedCount } = checked;
      acknowledged === true && modifiedCount === 1
        ? res.send({
            message: "OTP verified",
            status: 200,
            data: { email: data?.email },
          })
        : null;
    } else {
      res.send({
        message: "OTP Not verified",
        status: 404,
      });
    }
  } catch (err) {
    res.send({
      message: "Data not found",
      status: 404,
    });
  }
};

const User_Reset_Password = async (req, res, next) => {
  const typed_email = req.query.email;
  const typed_password = req.body.password;

  const data = await User.findOne({ email: typed_email });
  if (typed_email == data?.email) {
    const gen_password = CryptoJS.AES.decrypt(
      data?.password,
      process.env.SECRET_KEY
    );
    const original_password = gen_password.toString(CryptoJS.enc.Utf8);

    if (typed_password != original_password) {
      const users = await User.findOneAndUpdate(
        data?.email && data?._id,
        {
          $set: {
            password: CryptoJS.AES.encrypt(
              typed_password,
              process.env.SECRET_KEY
            ).toString(),
          },
        },
        { new: true }
      );

      const { password, ...others } = users;

      res.send({
        message: "Password Changed Successfully",
        status: 201,
        data: others._doc,
      });
    } else {
      res.send({
        message: "Password Not Changed",
        status: 404,
      });
    }
  }
};

const Delete_and_Blocked_Existing_User_Temporaray = async (req, res, next) => {
  try {
    const email = req.query.email;
    const is_Blocked = req.query.is_Blocked;
    const is_profile_deleted = req.query.is_profile_deleted;
    const Users = await User.findOne({ email: email });

    if (is_Blocked) {
      const reported_User = await User.findByIdAndUpdate(
        { _id: Users._id },
        { $set: { is_Blocked: is_Blocked } },
        { new: true }
      );
      res.send({
        message:
          reported_User?.is_Blocked === true
            ? `this user ${reported_User?.name} is Blocked successfully`
            : `this user ${reported_User?.name} is Un_Blocked successfully`,
        status: 201,
      });
    } else if (is_profile_deleted) {
      const reported_User = await User.findByIdAndUpdate(
        { _id: Users._id },
        { $set: { is_profile_deleted: is_profile_deleted } },
        { new: true }
      );
      res.send({
        message:
          reported_User?.is_profile_deleted === true
            ? `this user ${reported_User?.name} is Deleted successfully`
            : `this user ${reported_User?.name} is Restore successfully`,
        status: 201,
      });
    }
  } catch (err) {
    res.send({
      message: "Status Not Chnaged",
      status: 404,
    });
  }
};

const Turn_on_or_off_Notifications = async (req, res, next) => {
  const email = req.query.email;
  const notification = req.query.is_notification;
  try {
    const Notify = await User.findOne({ email: email });

    const reported_User = await User.findByIdAndUpdate(
      { _id: Notify._id },
      { $set: { is_notification: notification } },
      { new: true }
    );
    res.send({
      message:
        reported_User?.is_notification === true
          ? `this user ${reported_User?.name} has been Subscribed`
          : `this user ${reported_User?.name} has been Un_Subscribed`,
      status: 201,
    });
  } catch (err) {
    res.send({
      message: "Status Not Chnaged",
      status: 404,
    });
  }
};

const Logout_Existing_User = async (req, res, next) => {
  const ID = req.id;
  try {
    const Empty_token = await User.findOne({ _id: ID });
    const reported_User = await User.findByIdAndUpdate(
      { _id: Empty_token._id },
      { $set: { user_authentication: "" } },
      { new: true }
    );

    res.send({
      message: `${reported_User?.name} Logout Successfully`,
      status: 204,
    });
  } catch (err) {
    res.send({
      message: "Status Not Chnaged",
      status: 404,
    });
  }
};

const Register_With_Social_Login = async (req, res, next) => {
  try {
    const Data = {
      email: req.body.email,
      phone_number: req.body.phone_number,
      user_social_token: req.body.user_social_token,
      user_social_type: req.body.user_social_type,
      user_device_token: req.body.user_device_token,
      user_device_type: req.body.user_device_type,
    };
    if (Data.user_social_type === "Google") {
      const socialUser = await User.create(Data);
      const expiresIn = socialUser.role === "User" ? "1h" : "23h";
      const token = jwt.sign(
        {
          id: socialUser._id,
          role: socialUser.role,
          user_social_token: socialUser.user_social_token,
          user_social_type: socialUser.user_social_type,
          user_device_type: socialUser.user_device_type,
          user_device_token: socialUser.user_device_token,
        },
        process.env.SECRET_KEY,
        { expiresIn }
      );

      const socail = await User.updateOne(
        { _id: socialUser._id },
        { $set: { user_authentication: token, is_verified: true } },
        { new: true }
      );

      const { acknowledged, modifiedCount } = socail;
      if (acknowledged === true && modifiedCount === 1) {
        const token = await User.findOne({ _id: socialUser._id });
        const { user_authentication, ...others } = token;
        return res.status(200).send({
          message: `Social Login Successfully`,
          data: user_authentication,
        });
      }
    }

    if (Data.user_social_type === "Apple") {
      const socialUser = await User.create(Data);
      const expiresIn = socialUser.role === "User" ? "1h" : "23h";
      const token = jwt.sign(
        {
          id: socialUser._id,
          role: socialUser.role,
          user_social_token: socialUser.user_social_token,
          user_social_type: socialUser.user_social_type,
          user_device_type: socialUser.user_device_type,
          user_device_token: socialUser.user_device_token,
        },
        process.env.SECRET_KEY,
        { expiresIn }
      );

      const socail = await User.updateOne(
        { _id: socialUser._id },
        { $set: { user_authentication: token, is_verified: true } },
        { new: true }
      );

      const { acknowledged, modifiedCount } = socail;
      if (acknowledged === true && modifiedCount === 1) {
        const token = await User.findOne({ _id: socialUser._id });
        const { user_authentication, ...others } = token;
        return res.status(200).send({
          message: `Social Login Successfully`,
          data: user_authentication,
        });
      }
    }
    
    if (Data.user_social_type === "Phone") {
      const socialUser = await User.create(Data);
      const expiresIn = socialUser.role === "User" ? "1h" : "23h";
      const token = jwt.sign(
        {
          id: socialUser._id,
          role: socialUser.role,
          user_social_token: socialUser.user_social_token,
          user_social_type: socialUser.user_social_type,
          user_device_type: socialUser.user_device_type,
          user_device_token: socialUser.user_device_token,
        },
        process.env.SECRET_KEY,
        { expiresIn }
      );

      const socail = await User.updateOne(
        { _id: socialUser._id },
        { $set: { user_authentication: token, is_verified: true } },
        { new: true }
      );

      const { acknowledged, modifiedCount } = socail;
      if (acknowledged === true && modifiedCount === 1) {
        const token = await User.findOne({ _id: socialUser._id });
        const { user_authentication, ...others } = token;
        return res.status(200).send({
          message: `Social Login Successfully`,
          data: user_authentication,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  Register_New_User,
  LoginRegisteredUser,
  VerifyRegisteredUser,
  Update_Existing_User,
  Delete_Existing_User_Permanently,
  Delete_and_Blocked_Existing_User_Temporaray,
  User_Forget_Password,
  OTP_Verification,
  User_Reset_Password,
  Turn_on_or_off_Notifications,
  Logout_Existing_User,
  Complete_Profile,
  Register_With_Social_Login,
};
