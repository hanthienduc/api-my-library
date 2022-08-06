const express = require('express')
const Author = require('../models/author')
const router = express.Router()
const Book = require('../models/book')

// All books route
router.get('/', async (req, res) => {

    let query = Book.find()
    try {
        const books = await query.exec()
        res.json({ books: books })
    } catch (err) {
        res.redirect('/')
    }

})

// Search book route
router.get('/search?', async (req, res) => {

    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.json({ books: books, searchOptions: req.query })
    } catch (err) {
        res.redirect('/')
    }

})

// Create Book route
router.post('/new', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    })
    try {
        const newBook = await book.save()
        res.json({ bookId: newBook._id })
    } catch (err) {
        res.json({ err: err })
    }
})

// Show book Route
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('author').exec()
        res.json({ book: book })
    } catch {
        res.redirect('/')
    }
})


// Edit Book Route
router.put('/update/:id', async (req, res) => {
    let book

    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = req.body.publishDate
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.imageUrl != null && req.body.imageUrl != '') {
            book.imageUrl = req.body.imageUrl
        }
        await book.save()
        res.json({ bookId: book.id })

    } catch (err) {
        if (book != null) {
            res.json({ book: book })
        } else {
            res.redirect('/')
        }
    }
})

router.delete('/delete/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if (book != null) {
            res.json({ book: book, errorMessage: 'could not remove book' })
        } else {
            res.redirect('/')
        }
    }
})

module.exports = router