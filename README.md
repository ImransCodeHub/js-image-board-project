## Image Board Project

This project is a web application for creating and browsing an image board. It allows users to search for images based on tags, view individual images with associated tags and comments, and post new images with tags.

### Features

- Search for images based on tags
- View images in a grid layout
- View individual images with associated tags and comments
- Post new images with tags

### Technologies Used

- Node.js for the backend
- HTML, CSS, and JavaScript for the frontend
- Express.js for handling HTTP requests
- JSON files for storing image data
- RESTful API endpoints for interaction

### Project Structure

- `server.js`: Node.js file for the backend server
- `image.js`: contains the code to fetch and display image details
- `Post.js`: Client-side JavaScript file that contains the logic for the 'post.html' page.
- `webpage.js`: Contains the main JavaScript code that is run when the webpage is loaded.
- `index.html`: HTML file for the home page
- `post.html`: HTML file for the post page
- `style.css`: CSS file for styling the webpages
- `images/`: Folder containing images used in the project

### How to Use

1. Clone the repository: `git clone https://github.com/ImransCodeHub/js-image-board-project.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Access the application in your web browser at `http://localhost:8080`

### API Endpoints

- **POST /image**: Post a new image with tags
- **GET /image**: Retrieve all images
- **GET /image/search**: Retrieve images based on tags
- **GET /image/search?tags=<tag1,tag2,...>**: Retrieve images based on tags
- **POST /image/<Image-ID>**: Post a new image with tags
- **GET /image/<Image-ID>/comment**: Retrieve comments for an image
- **POST /image/<Image-ID>/comment**: Post a new comment for an image

### Limitations

- The application does not support user accounts
- The application does not support image uploads
- The application does not support image deletion

### License

No license

---