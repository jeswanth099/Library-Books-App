


#📦 Installation of Dependencies

npm init -y,

npm install express mongoose body-parser method-override


 # 🚀 then:to run this app commands
mongod
node server.js


# 📚 Library Books App

A simple Express.js app to manage a collection of books. Users can add, view, edit, and delete books using a MongoDB backend and EJS for templating.


## 🚀 Features

- Add new books with Title, Author, Genre, and Published Year.
- View all books in a table layout.
- Edit or delete books.
- Input validation using HTML5.
- Styled with basic CSS.
- Built-in search or filter (optional feature).

- Attach userId when creating a book

-Filter books by the logged-in user's userId

-Ensure only the book's owner can edit/delete it

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS templating engine
- Bootstrap 5 (for styling)
- bcrypt (for password hashing)
- express-session (for session management)
- method-override (for supporting PUT/DELETE methods)

🧪 Usage
Make sure MongoDB is running locally, then
node server.js

Visit http://localhost:3000/books to view the book list.
Visit http://localhost:3000/books/new to add a new book.



## 🏗️ Project Status

✅ HTML/CSS for basic styling ,

✅ Views rendered with EJS templates

🚧 Search/filter feature (in progress)

❌ Connected to local MongoDB using Mongoose 


💡 TODO / Stretch Goals

-To slove Error in Connecting to local MongoDB using Mongoose

-Add search and filter functionality

-Add pagination

-Improve UI 

