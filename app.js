const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport"); //Аналогичен Guards из ангуляр, не даёт нам гулять по урлам, пока мы не авторизуемся
const app = express();
const keys = require("./config/keys");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const analyticRoutes = require("./routes/analytic");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const positionRoutes = require("./routes/position");

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((error) => console.log(error));

app.use(passport.initialize());
require("./middleware/passport")(passport);

/* пакет morgan() служит для того чтобы, мы могли более красиво
логировать некоторые запросы, то есть смотреть что происходит с сервером, в данный момент */
app.use(require("morgan")("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true })); //позволяет энкодировать некоторые url которые нам приходят
app.use(bodyParser.json()); //позволяет генерировать js объекты из json который мы получаем
/* пакет cors() служит для того чтобы, наш сервер мог обрабатывать cors запросы. 
Если клиент будет находится на другом домене, то мы сможем всё равно отвечать нашим серверам */
app.use(require("cors")());
app.use("/api/auth", authRoutes); //свойство use() позволяет добавлять различные плагины или роуты
app.use("/api/analytics", analyticRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/position", positionRoutes);

module.exports = app;
