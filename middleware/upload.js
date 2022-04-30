const multer = require("multer");
const moment = require("moment");

/* тут будет конфигурировать местоположение наших файлов, то есть
как они будут загружаться и как они будут храниться. */
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    const date = moment().format("DDMMYYYY-HHmmss_SSS");
    callback(null, `${date}-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

/* Нужно лимитировать размер картинок который мы загружаем */
const limits = {
  fileSize: 1024 * 1024 * 5,
};

/* Здесь мы напишем некоторую базовую конфигурацию для, загрузки наших файлов
то есть, некоторые проверки, путь куда мы будем сохранять все наши файлы, и после того как 
конфигурация будет готова, мы экспортируем наружу объект, который позволит нам удобно работать,
с загрузкой файлов*/
module.exports = multer({
  storage,
  fileFilter,
  limits,
});
