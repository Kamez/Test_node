const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/ikamez', {
  useNewUrlParser: true,
  useFindAndModify: false
})

app.use(express.json())

app.get('/products', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id) // findById() มีค่าเท่ากับ findOne({ _id: '' })
    res.json(product)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.post('/products', async (req, res) => {
  const payload = req.body
  try {
    const product = new Product(payload)
    await product.save()
    res.status(201).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

app.put('/products/:id', async (req, res) => {
  const payload = req.body
  const { id } = req.params
  // {new: true} for get lastest update (default was false)
  // const product = await Product.findByIdAndUpdate(id, { $set: payload })
  try {
    const product = await Product.findOneAndUpdate({_id: id}, {$set: payload}, {new: true})
    res.json(product)
  } catch (error) {
    res.status(400).json(error)
  }
})

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Product.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    res.status(400).json(error)
  }
})

app.listen(9000, () => {
  console.log('Application is running on port 9000')
})
