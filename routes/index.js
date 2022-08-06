const express = require('express')
const router = express.Router()
const Book = require('../models/book')
router.get('/', async (req, res) => {
    let books = []
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).select('').limit(10).exec()
    } catch {
        books = []
    }
    res.json({ books: books })
})

router.get('/imgur_api_key', (req, res) => {
    res.json({ apiKey: process.env.imgur_client_id })
})

module.exports = router