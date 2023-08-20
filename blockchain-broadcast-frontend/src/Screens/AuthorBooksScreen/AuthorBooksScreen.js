import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getBooksByAuthor } from '../../Redux/actions/authorActions';
import Book from '../../Components/Book/Book';
import Loading from '../../Components/Loading/Loading';

const AuthorBooksScreen = ({ match }) => {

  const dispatch = useDispatch();
  const authorBooks = useSelector((state) => state.getBooksByAuthor);
  const { loading, error, booksByAuthor } = authorBooks;

  useEffect(() => {
    dispatch(getBooksByAuthor(match.params.id));
  }, [dispatch, match.params.id]);

  const books = (booksByAuthor.books || {})[0] || {};
  const author = books.authorName;


  return (
    <div className="screen screen-h-padding">
      {loading ?
        <Loading />
        :
        (
          error ? (
            <h2>{error}</h2>
          ) : (<>
            <h2 className="centered_header">Books by {author}</h2>
            <div className="homescreen__products">
              {(booksByAuthor.books) ?
                (booksByAuthor.books).map(book =>
                  <Book
                    key={book._id}
                    title={book.title}
                    price={book.price}
                    rating={book.rating}
                    cover={book.cover}
                    bookId={book._id}
                    authorId={book.author}
                    authorName={book.authorName}
                  />
                )
                :
                <p>No books records for this author</p>}
            </div></>))
      }
    </div>
  );
};

export default AuthorBooksScreen;
