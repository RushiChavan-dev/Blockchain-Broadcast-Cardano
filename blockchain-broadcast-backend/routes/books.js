import json from 'body-parser';
import { Router } from 'express';
import { Book } from '../models/bookModel.js';
const router = Router();

// Handle get request (all books)
router.route('/').get(async (req, res) => {
    await Book.find()
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by title A-Z)
router.route('/getByTitleAZ').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);

    await Book.find(filter).sort({ title: 1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by title Z-A)
router.route('/getByTitleZA').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);

    await Book.find(filter).sort({ title: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by Author A-Z)
router.route('/getByAuthorAZ').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ authorName: 1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by Author Z-A)
router.route('/getByAuthorZA').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ authorName: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Handle get request (Sort by amount sold descending)
router.route('/getByTS').get(async (req, res) => {
    //console.log(req.query.filter)
    const filter = JSON.parse(req.query.filter);
    //console.log(filter)
    await Book.find(filter).sort({ sold: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by rating high to low)
router.route('/getByRatingHL').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ rating: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by rating low to high)
router.route('/getByRatingLH').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ rating: 1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by price high to low)
router.route('/getByPriceHL').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ price: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle get request (Sort by price low to high)
router.route('/getByPriceLH').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ price: 1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Hande get request (Sort by Release date Newest to Oldest)
router.route('/getByRDNO').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ releaseDate: -1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Hande get request (Sort by Release date Oldest to Newest)
router.route('/getByRDON').get(async (req, res) => {
    const filter = JSON.parse(req.query.filter);
    await Book.find(filter).sort({ releaseDate: 1 })
        .then(books => res.json(books))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Handle post request (data population)
router.route('/add').post((req, res) => {
    const newBook = new Book(req.body);
    newBook.save()
        .then(() => res.json('Book added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific book
router.route('/:id').get(async (req, res) => {
    await Book.findById(req.params.id)
        .populate('genre')
        .populate('author')
        .then(book => res.json(book))
        .catch(err => res.status(400).json('Error: ' + err));
});
// Increment count of books sold
router.route('/purchase/:id').patch(async (req, res) => {
    try {
        const _id = req.params.id;
        const sold = req.body.sold;
        const result = await Book.findByIdAndUpdate(_id, {
            $inc: { sold: sold }
        });
        res.send(result);
    } catch (error) {
        console.log(error.message);
    }
});


router.route('/review/:id').put(async function (req, res) {

    const id = req.params.id;
    const commenter = req.body.commenter;
    const title = req.body.title;
    const content = req.body.content;
    const rating = req.body.rating;
    const average = req.body.average;

    const newReview = {
        commenter: commenter,
        title: title,
        content: content,
        rating: rating
    };

    const newRating = average;

    Book.findByIdAndUpdate(
        id,
        {
            $push: { "comments": newReview },
            $set: { "rating": newRating },
            $inc: { "numComments": 1 }
        },
        { safe: true, upsert: true, new: true },
        function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

export default router;
