const prodiModel = require('../models/prodiModel');
const dosenModel = require('../models/fakultasModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.getAll = (req, res) => {
  const prodiId = req.query.prodiId ? parseInt(req.query.prodiId) : undefined;
  res.json(dosenModel.getAll(prodiId));
};

exports.getById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const data = dosenModel.getById(id);
  if (!data) return next(errorHttp(404, 'Dosen tidak ditemukan'));
  res.json(data);
};

exports.create = (req, res, next) => {
  const { nama, jenjang, prodiId } = req.body;
  if (!nama || !jenjang || !prodiId) {
    return next(errorHttp(400, 'nama, jenjang, dan prodiId wajib diisi'));
  }

  // Controller mengoordinasikan dua Model: memvalidasi relasi
  // sebelum data baru dibuat di dosenModel.
  const indukProdi = prodiModel.getById(parseInt(prodiId));
  if (!indukProdi) return next(errorHttp(400, 'prodiId tidak ditemukan'));

  const baru = dosenModel.create({ nama, jenjang, prodiId: parseInt(prodiId) });
  res.status(201).json(baru);
};