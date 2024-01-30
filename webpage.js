$(document).ready(function() {
    const searchButton = $("#searchButton");
    const searchTagsInput = $("#searchTags");
    const imageList = $("#imageList");
    const tagList = $("#tagList");
    const postImageNavButton = $("#postImageNavButton");

    searchButton.on("click", async function() {
        const searchTags = searchTagsInput.val().split(" ");
        if (searchTags.length === 0) {
            await searchImages([]);
        } else {
            const matchingImages = await searchImages(searchTags);
    
            if (matchingImages.length > 0) {
                window.location.href = `http://localhost:8080/image.html/${matchingImages[0]}`;
            } else {
                updateImageList(matchingImages);
            }
        }
    });
    

    postImageNavButton.on("click", async function() {
        window.location.href = "http://localhost:8080/post.html"
    });

    fetchImages();

    // Function to search for images based on tags
    async function searchImages(tags) {
        try {
            const response = await fetch(`/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tags: []})
            });

            if (!response.ok) {
                throw new Error('Error searching images');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching images:', error);
            return [];
        }
    }

    // Function to fetch and display initial images
    async function fetchImages() {
        try {
            const initialTags = ['initial', 'tags'];
            const initialImages = await searchImages(initialTags);
            updateImageList(initialImages);
        } catch (error) {
            console.error('Error fetching initial images:', error);
        }
    }

    // Function to update the image list with image IDs
    async function updateImageList(images) {
        imageList.empty();
        tagList.empty();
        const tags = [];

        for(const imageId in images){
            const imagePromise = await fetch("http://localhost:8080/image/"+images[imageId]);
            const image = await imagePromise.json();
            
            console.log(image.url);

            const url = image.url;
            // const imageItem = $(
            //     `<div class="image">`+
            //         `<a href="http://localhost:8080/image.html/${images[imageId]}">`+
            //         `<img src=${url} alt="error loading image"></a>`+
            //     `</div>`);
            // imageList.append(imageItem);

            const imageItem = $(
                `<div class="image">` +
                `<a href="http://localhost:8080/image.html/${images[imageId]}">` + // Added anchor tag
                `<img src=${url} alt="error loading image"></a>` + // Wrapped the image in anchor tag
                `</div>`);
            imageList.append(imageItem);
            

            const imageTags = image.tags.split(',');
            console.log(imageTags);
            for(const tag in imageTags) {
                if (!tags.includes(imageTags[tag])) {
                    tags.push(imageTags[tag]);
                }
            }
        }
        console.log(tags)
        if(tags.length > 0) {
        const tagsItem = $(
            `<p>Tags: ${tags}</p>`
        );
        tagList.append(tagsItem);
        }
    }
});
