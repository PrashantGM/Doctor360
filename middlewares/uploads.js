const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./");
  },
  filename: function (req, file, cb) {
    req.fileIndentifier = Date.now() + file.originalname;
    cb(null, req.fileIndentifier);
  },
});
const fileFilter = function (req, file, cb) {
  if (file.mimetype == "image/jpeg"||file.mimetype=="image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  // fileFilter:fileFilter
});

exports.upload = upload;
