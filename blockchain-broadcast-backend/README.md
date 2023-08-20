# blockchain Broadcast

Blockchain Broadcast is an online web application bookstore built using the MERN stack.

This is the backend for the Blockchain Broadcast web app developed as a group project for our Spring 2021 CEN 4010 Software Engineering course.

## Development Team
Below are the developers of this project and their assigned features.
- [Andrew Andersen](https://github.com/pandamon99) (Book Browsing and Sorting)
- [Azhar Ali](https://github.com/azhareus) (Book Rating and Commenting)
- [Celeste Amengual](https://github.com/celesteamen) (Wishlist Management)
- [Jonathan Attias Khoudari](https://github.com/jattias96) (Book Details)
- [Leanet Alfonso Azcona](https://github.com/leanetalfonso) (Shopping Cart)
- [William Aranzabal](https://github.com/cab-aranw) (Profile Management)

## Running Locally

Clone the repo

```
git clone https://github.com/LeanetAlfonso/geek-text-backend.git
```

Change directory

```
cd geek-text-backend
```

Install dependencies

```
npm install
```

Add environment variables

```
touch .env
echo mongoURI={enter_mongodb_url_here} >> .env
echo cookie_secret={enter_cookie_secret_here} >> .env
```


Run app

```
npm start
```
