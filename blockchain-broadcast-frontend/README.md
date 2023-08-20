# Blockchain Broadcast

Blockchain Broadcast is an online Dapp application bookstore built using the MERN stack and Cardano.

This is the frontend for the Blockchain Broadcast Dapp developed as a group project for our Summer 2023 T475 Blockchain Developement course.

## Development Team
Below are the developers of this project and their assigned features.
- [Rutuja Dalvi](https://www.linkedin.com/in/rutuja-dalvi-developer/)




## Features

| <div style="width:130px">Feature</div> | Description                                                                                                                                                                                                                                                                                                                                                                | <div style="width:230px">Benefit</div>                                                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Book Browsing and Sorting              | Allow user to browse books by genre, top sellers in our book store, and book rating with pagination based on 10 or 20 results. Allow Sort by book title, author, price, book rating, and release date.                                                                                                                                                                     | Users will have a simple and enjoyable way to discover new books and Authors and sort results.           |
| Profile Management                     | Users can manage their login credentials (ID, password), personal information (name, email address, home address), nickname for book rating and commenting, credit card information (multiple), and shipping address (multiple). Physical addresses, email addresses, and credit card info should be verified as valid. Passwords must meet our current security standards | Users can create and maintain their profiles rather than enter in their information each time they order |
| Shopping Cart                          | Users can easily access their cart from any page, view the same information displayed in the book list, change the quantity, remove it from their cart or save it for later. A subtotal for all items in their shopping cart should be displayed. Items saved for later should appear below the cart items.                                                                | Users can manage items in a shopping cart for immediate or future Purchase                               |
| Book Details                           | Display book name, book cover (which can be enlarged when clicked), author and bio, book description, genre, publishing info (publisher, release date, etc.), book rating, and comments. Hyperlink author’s name to a list of other books by the same author.                                                                                                              | Users can see informative and enticing details about a book                                              |
| Book Rating and Commenting             | For Rating: Use a five-star rating system. Users can rate any book. For Commenting: A single comment should be limited to the number of characters, which can fit within half the browser window (so that there are at least two comments which can appear at the same time).                                                                                              | Users can rate AND comment on books they’ve purchased to help others in their selection                  |
| Wishlist Management                    | The wishlist section shows the items that have been added to the list by the user and each item can be added to the cart. Items can be added to the list from the item details page, browser, and cart. Items can be removed from the list in this section.                                                                                                                | Users can have a wishlist which can have books moved to the shopping cart.                               |

## Requirements

node v16.10 (some later versions of node do not work with netlify dev)

## Running Locally

First, make sure the backend is already running locally and a server connection has been established successfully. For instructions on how to run the backend locally please go to [blockchain-broadcast-backend](https://github.com/Rushi/blockchain-broadcast-backend).

Clone the repo

```
git clone https://github.com/Rushi/blockchain-broadcast-frontend.git
```

Change directory

```
cd blockchain-broadcast-frontend
```

Install dependencies

```
yarn install
```

Add environment variable

```
touch .env
echo REACT_APP_BACKEND_URL={enter_backend_url_here} >> .env
```

Run app and netlify serverless functions

```
netlify dev
```
