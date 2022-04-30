const Position = require("../models/Position");
const errorHandler = require("../utils/errorHandler");

module.exports.getByCategoryId = async (req, res) => {
  try {
    const positions = await Position.find({
      category: req.params.categoryId,
      user: req.user.id,
    });
    res.status(200).json(positions);
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports.create = async (req, res) => {
  try {
    const position = await new Position({
      name: req.body.name,
      cost: req.body.cost,
      category: req.body.category,
      user: req.user.id,
    }).save(); //Создаём новую позицию
    res.status(201).json(position);
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports.delete = async (req, res) => {
  try {
    await Position.remove({ _id: req.params.id });
    res.status(200).json({
      message: "Position has been deleted.",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
module.exports.update = async (req, res) => {
  try {
    const position = await Position.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      } /* в req.body у нас будут храниться те данные, которые позволят нам изменить значение определённой записи*/,
      {
        new: true,
      } /* данный параметр делает следующее: он обновит определённую запись в mongoose и только после этого нам его вернёт.
      Если не добавить этот параметр, то в таком случае получим запись до изменений, а это
      не совсем корректно с точки зрения клиента и сервера */
    );
    res.status(200).json(position); //возвращаем обратно позицию
  } catch (error) {
    errorHandler(res, error);
  }
};
