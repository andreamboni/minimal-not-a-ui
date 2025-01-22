let currentPage = 0;
let totalPages = 0;
const baseUrl = "http://localhost:8090/getBlogPosts?page="
const mainWrapper = document.getElementById("main-wrapper");
const contentWrapper = document.getElementById("content-wrapper")
const firstPageButton = document.getElementById("fp-button")
const prevButton = document.getElementById("prev-button")
const nextButton = document.getElementById("next-button")

async function getPosts(page) {
    console.log("page", currentPage)

    try {
        const response = await fetch(`${baseUrl}${page}`)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const data = await response.json()
        const blogPosts = data.content

        contentWrapper.innerHTML = "";

        blogPosts.forEach(blogPost => {
            const article = createArticle(blogPost);
            contentWrapper.appendChild(article)
            
        });

        totalPages = data.totalPages;

        if (currentPage > 0) {
            console.log("current page", currentPage)
            prevButton.disabled = false
            firstPageButton.disabled = false
        } else {
            firstPageButton.disabled = true
            prevButton.disabled = true
        }

        if (currentPage == totalPages) {
            nextButton.disabled = true
        }


    } catch (error) {
        console.error(error.message)
    }
}

function createArticle(blogPost) {
    const article = document.createElement("article");
    article.className = "blog-post"

    const titleAndMetaSection = createTitleAndMetaSection(blogPost);
    const contentSection = createContentSection(blogPost);
    const moodAndTagsSection = createMoodAndTagsSection(blogPost);

    article.appendChild(titleAndMetaSection)
    article.appendChild(contentSection)
    article.appendChild(moodAndTagsSection)

    return article;
}

function createTitleAndMetaSection(blogPost) {
    const titleAndMetaSection = document.createElement("section");
    titleAndMetaSection.className = "title-section";

    // Post image
    const figureTag = document.createElement("figure")
    const postImage = document.createElement("img")
    postImage.className = "title-img"
    postImage.src = blogPost.postImage
    figureTag.appendChild(postImage)

    // Title and The Date
    const title = document.createElement("h2")
    const titleContent = document.createTextNode(blogPost.title)
    title.appendChild(titleContent)

    const theDate = document.createElement("span");
    const theDateContent = document.createTextNode(blogPost.theDate);
    theDate.appendChild(theDateContent);

    const titleAndTheDate = document.createElement("section")
    titleAndTheDate.className = "title-thedate-section";
    titleAndTheDate.appendChild(title);
    titleAndTheDate.appendChild(theDate);

    // Meta
    const metaSection = createMetaSection(blogPost.postHashCode, titleContent.textContent, blogPost.url);

    titleAndMetaSection.appendChild(figureTag);
    titleAndMetaSection.appendChild(titleAndTheDate);
    titleAndMetaSection.appendChild(metaSection);

    return titleAndMetaSection
}

function createMetaSection(postHashCode, title, postLink) {
    const metaList = document.createElement("ul");

    const hashSpan = document.createElement("span")
    hashSpan.className = "span-bold"
    hashSpan.textContent = "Hash: "

    const hash = document.createElement("li");
    const hashContent = document.createElement("span")
    hashContent.textContent = postHashCode.substring(0, 16)
    hash.appendChild(hashSpan)
    hash.appendChild(hashContent)

    const linkSpan = document.createElement("span");
    linkSpan.className = "span-bold";
    linkSpan.textContent = "Link: "

    const linkAnchor = document.createElement("a");
    linkAnchor.href = postLink;
    linkAnchor.target = "_blank"
    linkAnchor.innerHTML = title;

    const linkLi = document.createElement("li")
    linkLi.appendChild(linkSpan)
    linkLi.appendChild(linkAnchor)

    metaList.appendChild(hash);
    metaList.appendChild(linkLi)

    const metaSection = document.createElement("section");
    metaSection.className = "meta-section";
    metaSection.appendChild(metaList)

    return metaSection;
}

function createContentSection(blogPost) {
    const contentSection = document.createElement("section");
    contentSection.className = "content-section";

    const content = document.createElement("div")
    const contentList = blogPost.content

    // console.log(contentList)
    for (i = 0; i < contentList.length; i++) {
        const p = document.createElement("p")
        p.innerHTML = contentList[i]
        content.appendChild(p)
    }

    contentSection.appendChild(content)

    return contentSection;
}

function createMoodAndTagsSection(blogPost) {
    const moodAndTagsSection = document.createElement("section");
    moodAndTagsSection.className = "mood-tags-section";

    const tags = document.createElement("p")
    tags.innerText = blogPost.tags

    moodAndTagsSection.appendChild(tags)
    return moodAndTagsSection;
}

// Handlers para os botões
firstPageButton.addEventListener('click', () => {
    if(currentPage > 0) {
        currentPage = 0;
        getPosts(currentPage);
    }
});

prevButton.addEventListener('click', () => {
    if(currentPage > 0) {
        currentPage--;
        getPosts(currentPage);
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    getPosts(currentPage);
});

getPosts(currentPage)