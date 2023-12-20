const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuid } = require('uuid');
const axios = require('axios');
const storage = require('../config/storage');

const {
  BUCKET_NAME,
  ML_API,
  RECIPE_API,
  RECIPE_API_KEY,
} = process.env;
const bucket = storage.bucket(BUCKET_NAME);

router.post('/ingredient', async function (req, res) {
  const image = req.file;

  try {
    const blob = bucket.file(image.originalname);
    blob.createWriteStream({
      resumable: false,
    })
      .on('error', function (error) {
        res.status(400)
          .json({
            'error': true,
            'message': 'Upload Failed',
            'data': error.message,
          })
          .end();
      })
      .on('finish', async function () {
        const name = uuid().toString() + path.extname(image.originalname);
        await blob.rename(name);

        const response = await axios.post(ML_API, {
          'image': name,
        });

        bucket.file(name).delete();

        if (response.status !== 200)
          throw new Error('Something Wrong');

        const { ingredients } = response.data;

        if (ingredients.length === 0) {
          res.status(400)
            .json({
              'error': true,
              'message': 'Object Detection Failed',
            })
            .end();
          return;
        }

        const recipes = await axios.get(`${RECIPE_API}/findByIngredients?ingredients=${ingredients.toString()}&apiKey=${RECIPE_API_KEY}`);

        res.status(200)
          .json({
            'error': false,
            'message': 'Object Detection Success',
            'ingredients': ingredients,
            'recipes': recipes.data,
          })
          .end();
      })
      .end(image.buffer);
  } catch (error) {
    res.status(500)
      .json({
        'error': true,
        'message': 'Server Error',
        'data': error.message,
      })
      .end();
  }
});

router.get('/random-recipes', async function (_, res) {
  try {
    const recipes = await axios.get(`${RECIPE_API}/complexSearch?cuisine=asian&number=6&apiKey=${RECIPE_API_KEY}`);
    res.status(200)
      .json({
        'error': false,
        'message': 'Some Recipes',
        'recipes': recipes.data,
      })
      .end();
  } catch (error) {
    res.status(500)
      .json({
        'error': true,
        'message': 'Server Error',
        'data': error.message,
      })
      .end();
  }

});

module.exports = router;
