import { Router } from 'express'
import { Author } from '../models/authorModel.js'

const router = Router();

// Handle get request
router.route('/').get((req, res)=>{
    Author.find()
    .then(authors => res.json(authors))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Handle post request
router.route('/add').post((req,res) => {
    
    const name = req.body.name;
    const bio = req.body.bio;

    const newAuthor = new Author({
        name,
        bio
    })

    newAuthor.save()
    .then(() => res.json('Author added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific author
router.route('/:id').get(async(req, res)=>{
    await Author.findById(req.params.id)
    .then(author => res.json(author))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get all books of a given author
router.route('/getbooksby/:id').get(async(req, res)=>{
  await Author.findById(req.params.id,'books')
  .populate({
      path: 'books',
      model: 'Book'})
  .then(author => res.json(author))
  .catch(err => res.status(400).json('Error: ' + err));
});

export default router;
