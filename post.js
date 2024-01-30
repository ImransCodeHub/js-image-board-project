$(document).ready(function() {
    const imageUrlInput = $("#imageUrl");
    const imageTagsInput = $("#imageTags");
    const postButton = $("#postButton");
    const imageBoardNavButton = $("#imageBoardNavButton");

    postButton.on("click", async function() {
        const imageUrl = imageUrlInput.val();
        const imageTags = imageTagsInput.val().split(" ");
        const success = await postImage(imageUrl, imageTags);
        if (success) {
            alert("Image posted successfully!");
            clearInputs();
        } else {
            alert("Failed to post image. Please check the console for details.");
        }
    });

    imageBoardNavButton.on("click", async function() {
        window.location.href = "http://localhost:8080/"

    });

    // Function to post an image
    async function postImage(url, tags) {
        const imageId = generateImageId();
        const postData = {
            url: url,
            tags: tags
        };
        const temp = JSON.stringify(postData);
        console.log(temp);

        try {
            const response = await fetch(`/image/${imageId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: temp
            });
            console.log(response);

            if (response.ok) {
                return true;
            } else {
                const errorData = await response.json();
                console.error('Error posting image:', errorData);
                return false;
            }
        } catch (error) {
            console.error('Error posting image:', error);
            return false;
        }
    }

    // Function to clear input fields
    function clearInputs() {
        imageUrlInput.val(""); 
        imageTagsInput.val("");
    }

    // Function to generate a unique image ID
    function generateImageId() {
        return 'img-' + Math.random().toString(36).substr(2, 9);
    }
});
