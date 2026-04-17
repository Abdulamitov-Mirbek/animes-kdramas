import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    preferences: {
      language: {
        type: String,
        default: "ru",
      },
      quality: {
        type: String,
        default: "720p",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      autoplay: {
        type: Boolean,
        default: true,
      },
      subtitles: {
        type: String,
        default: "ru",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

// ВРЕМЕННО ОТКЛЮЧАЕМ ХЕШИРОВАНИЕ ДЛЯ ТЕСТА
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// Сравнение паролей без хеширования для теста
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Временное прямое сравнение
  return this.password === candidatePassword;

  // После того как вход заработает, раскомментируйте это:
  // return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
