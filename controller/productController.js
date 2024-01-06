import multer from "multer"
import product from "../model/product.js"
import path from 'path'
import CustomErrorHandler from '../services/CustomErrorHandler.js';
import fs from 'fs'

const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, 'uploads/'),

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});


const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb




const productController = {
  async store(req, res, next) {
    handleMultipartData(req, res, async (err) => {

      if (err) {
        return next(CustomErrorHandler.serVerError(err.message));
      }
      // If all well..

      try {
        const { name, price, size } = req.body;

        const saveProduct = await product.create(
          {
            name,
            price,
            size,
            image: req.file.path
          }
        )
        res.json({ "product": saveProduct })

      } catch (error) {
        return next(new Error(error.message))
      }


    })
  },


  async update(req, res, next) {
    handleMultipartData(req, res, async (err) => {

      if (err) {
        return next(CustomErrorHandler.serVerError(err.message));
      }
      // If all well..
      const reqId = req.params.id;
      try {
        const { name, price, size } = req.body;

        const updateProduct = await product.findByIdAndUpdate(
          reqId,
          {
            $set: { name, price, size }
          }, {
          new: true
        }
        )
        res.json({ "product": updateProduct })

      } catch (error) {
        return next(new Error(error.message))
      }


    })

  },

  // DELETE PRODUCT

  async delete(req, res, next) {

    try {
      const DELOneProduct = await product.findByIdAndDelete(req.params.id);
      if (!DELOneProduct) {
        return next(CustomErrorHandler.unAuthorized('Invalid Product ID.'))
      }
      return res.json({ succes: true, msg: "product has been deleted." })
    }
    catch (err) {
      return next(err.message)
    }

  },

  // Get all PRODUCT

  async index(req, res, next) {
    try {
      const products = await product.find({}).select('-updatedAt -__v');
      if (!product) {
        return next(CustomErrorHandler.unAuthorized('No producta available.'))
      }

      const AvailableProducts = {
        products,
        total: products.length
      };

      res.json(AvailableProducts);

    } catch (error) {
      return next(error.message)
    }
  },


  async show(req, res, next) {
    try {

      const products = await product.findOne({ _id: req.params.id });
      if (!product) {
        return next(CustomErrorHandler.unAuthorized('Not FOund...'))
      }
      res.json(products)

    } catch (error) {
      return next(error)
    }
  }

};

export default productController
