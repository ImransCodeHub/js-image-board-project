"use strict";
const http = require('http');
const fs = require('fs').promises;
const url = require('url');
// const path = require('path');

const imageData = {};

const getFile = (res, filePath, contentType) => {
    res.writeHead(200, {'Content-Type': contentType});
    fs.readFile(filePath)
    .then(content => res.write(content))
    .then(_ => res.end());
}

// const getFile = async (res, filePath, contentType) => {
//     try {
//         const content = await fs.readFile(path.join(__dirname, filePath));
//         res.writeHead(200, { 'Content-Type': contentType });
//         res.write(content);
//         res.end();
//     } catch (error) {
//         console.error('Error reading file:', error);
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('Not Found');
//     }
// }

// Create an HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url); 
    const pathname = parsedUrl.pathname;
    const path = pathname.split('/'); 
    console.log(path);
    if (path[1] === '' && req.method === 'GET') {
        getFile(res, "index.html", "text/html"); 
    } else if (path[1] === 'image.html' && req.method === 'GET') {
        getFile(res, path[1], "text/html");
    } else if (path[1] === 'post.html' && req.method === 'GET') {
        getFile(res, path[1], "text/html");
    } else if (path[1] === 'styles.css' && req.method === 'GET') {
        getFile(res, path[1], "text/css");
    } else if (path[1] === 'webpage.js' && req.method === 'GET') {
        getFile(res, path[1], "text/javascript");
    } else if (path[1] === 'post.js' && req.method === 'GET') {
        getFile(res, path[1], "text/javascript")
    } else if (path[1] === 'image.js' && req.method === 'GET') {
        getFile(res, path[1], "text/javascript");
    } else if (pathname === '/search' && req.method === 'POST') {
        // Handle search requests
        handleSearchRequest(req, res); 
    } else if (pathname.startsWith('/image/') && req.method === 'GET') {
        // Handle requests for image details
        handleImageRequest(pathname, res); 
    } else if (pathname.startsWith('/image/') && pathname.endsWith('/comment') && req.method === 'POST') {
        let body = "";
        req.on('data', (chunk) => {body += chunk;});
        req.on('end', () => {
            const bodyContents = JSON.parse(body);
            // Handle requests for posting image comments
            handleImageCommentPostRequest(pathname, bodyContents, res);
    });
    } else if (pathname.startsWith('/image/') && req.method === 'POST') {
        let body = "";
        req.on('data', (chunk) => {body += chunk;});
        req.on('end', () => {
            const bodyContents = JSON.parse(body); 
            handleImagePostRequest(pathname, bodyContents, res); 
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 8080;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Function to handle search requests
function handleSearchRequest(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const requestedTags = JSON.parse(body).tags;
        const matchingImages = [];

        // Loop through images to find matches based on requested tags
        for (const imageId in imageData) {
            const image = imageData[imageId];
            const imageTags = image.tags;

            const hasAllTags = requestedTags.every(tag => imageTags.includes(tag));

            if (hasAllTags) {
                matchingImages.push(imageId);
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(matchingImages));
    });
}

// Function to handle requests for image details
function handleImageRequest(pathname, res) {
    const imageId = pathname.split('/')[2]; 
    
    fs.readFile("images/"+imageId+".json")
    .then(content => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(content);
        res.end();
    }).catch( _ => {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.write('{"error": "No post for given ID"}');
        res.end();
    });
}

// handle image post request 
function handleImagePostRequest(pathname, bodyContents, res) {
    const imageId = pathname.split('/')[2];
    const url = bodyContents.url;
    const tags = bodyContents.tags;

    imageData[imageId] = {
        url: url,
        tags: tags,
        comments: []
    };

    fs.writeFile("images/"+imageId+".json", `{
        "imageId": "${imageId}",
        "url": "${url}",
        "tags": "${tags}",
        "comments": []
    }`
    ).then( content => {
        res.writeHead(200, {'Content-Type': 'application/json' });
        res.write("");
        res.end();
    }).catch( _ => {
        res.writeHead(404, {'Content-Type': 'application/json' });
        res.write('{"error": "Issue writing image to json file while posting"}');
        res.end();
    });
}

// Function to handle requests for posting image comments
function handleImageCommentPostRequest(pathname, bodyContents, res) {
    const imageId = pathname.split('/')[2];
    fs.readFile(`images/${imageId}.json`)
    .then(content => {
        const image = JSON.parse(content);
        image.comments.push(bodyContents);
        return fs.writeFile(`images/${imageId}.json`, JSON.stringify(image));
    }).then(_ => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write('{"success": "Added comment successfully"}');
        res.end();
    }).catch( _ => {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.write('{"error": "Failed to add comment"}');
        res.end();
    });

    if (imageData[imageId]) {
        imageData[imageId].comments.push(bodyContents);
    }
}

