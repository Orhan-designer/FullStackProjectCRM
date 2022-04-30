const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const options = {
  /* Мы говорим стратегии passportjs что, мы будем брать токен, который будет находится в header-aх */
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select("email id");

        if (user) {
          //Если пользователь найден, добавляем данные
          done(null, user);
        } else {
          //Если пользователь не найден
          done(null, false);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }) //добавляем пасспорту новую стратегию
  );
};
