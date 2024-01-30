$(document).ready(function() {
    const imageContainer = $("#imageContainer");
    const tagsContainer = $("#tags");
    const commentsList = $("#comments");
    const imageReturnButton = $("#imageReturnButton");
    const commentAdded = $("#addComment");
    const postCommentButton = $("#postCommentButton");

    fetchImageDetails();

    imageReturnButton.on("click", async function() {
        window.location.href = "http://localhost:8080/"
    });

    postCommentButton.on("click", async function() {
        const comment = commentAdded.val();
        addComment(comment, getImageIdFromUrl());
        commentAdded.val("");
    });



// Function to fetch and display image details
async function fetchImageDetails() {
    const imageId = getImageIdFromUrl();
    console.log(imageId);

    const image = await getImage(imageId);

    displayImage(image);
    displayComments(image.comments);
}

// Function to extract the image ID from the URL
function getImageIdFromUrl() {

    const urlParams = window.location.href;
    console.log(urlParams);
    return "img-" + urlParams.split('/img-')[1];
}

// Function to fetch image details using an API call
async function getImage(imageId) {
    try {
        const response = await fetch(`/image/${imageId}`);

        if (!response.ok) {
            throw new Error("Image not found");
        }
        
        const image = await response.json();
        console.log(image);
        return image;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}

// Function to display the image in the container
async function displayImage(image) {
    imageContainer.empty();

    const imgElement = $("<img>").attr("src", image.url);
    imageContainer.append(imgElement);
    tagsContainer.text("Tags: " + image.tags);
}

// Function to display comments in the list
function displayComments(comments) {
    commentsList.empty();

    // Loop through each comment and create a list item
    comments.forEach(function(comment) {
        const commentItem = $("<li>").text(comment);

        commentsList.append(commentItem);
    });
}

async function addComment(comment, imageId) {
    const response = await fetch(`/image/${imageId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    });
    fetchImageDetails();
};

});



