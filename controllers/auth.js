const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const errorHandler = require("../utils/errorHandler");
const User = require("../models/User");

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    //Проверка пароля, пользователь существует
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );

    if (passwordResult) {
      //Если true, то мы должны сгенерировать токен, пароли совпали
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwt,
        { expiresIn: 60 * 60 } //время существования токена 1 час
      );

      res.status(200).json({
        token: `Bearer ${token}`,
      });
    } else {
      //Если пароли не совпали, то выбрасывается ошибка
      res.status(401).json({
        message: "Incorrect password. Please enter a valid password",
      });
    }
  } else {
    //Пользователя нет, ошибка
    res.status(404).json({
      message: `User with this email - ${req.body.email} not found.`,
    });
  }
};

module.exports.register = async (req, res) => {
  //email and password

  //наш код будет ждать выполнение данной ф-ии, и только после продолжать выполнение всего остального кода
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    //Пользователь существует, нужно отправить ошибку
    res.status(409).json({
      message: `Данный email - ${req.body.email} существует. Попробуйте другой email`,
    });
  } else {
    //Нужно создать пользователя
    const salt = bcrypt.genSaltSync(10); //с его помощью будем делать шифрование
    const password = req.body.password;

    const user = new User({
      email: req.body.email,
      //hashSync позволяет создавать хэш нужного нам пароля
      //первым параметром передаём, ту строку которую нам нужно захэшировать, в данном строка password
      password: bcrypt.hashSync(
        password,
        salt
      ) /* теперь когда создаётся пользователь,
      вместо пароля который мы передаём от клиента, сюда мы будем получать некоторый хэш, 
      который мы создаём с данной библиотеки*/,
    });

    try {
      //подождём пока выполнится данный код, и потом уже будем что либо делать
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      //Обработать ошибку
      errorHandler(res, error);
    }
  }
};
