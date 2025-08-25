const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

//Static method for password verification
userSchema.static(
  "matchPasswordAndGenrateToken",
  async function (email, password) {
    const user1 = await this.findOne({ email });
    if (!user1) {
      throw new Error("User not found");
    }

    const userProvidedHash = createHmac("sha256", user1.salt)
      .update(password)
      .digest("hex");

    if (user1.password === userProvidedHash) {
      user1.password = undefined;
      user1.salt = undefined;
      return createTokenForUser(user1);
    } else {
      throw new Error("Incorrect password");
    }
  }
);

const User = model("user", userSchema);
module.exports = User;
