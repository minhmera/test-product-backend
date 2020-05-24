const express = require('express');

const router = express.Router();
const upload = require('../services/image_upload');

const singleUpload = upload.single('image');

router.post('/', (req, res) => {
  console.log(' ******  Test upload image  ***** ');

  singleUpload(req, res, (err, some) => {
    if (err) {
      return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
    }

    return res.json({ imageUrl: req.file.location });
  });
});

module.exports = router;
