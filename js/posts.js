let numPages = 0;
let currentPage = 0;
let numPosts = 0;
document.addEventListener('DOMContentLoaded', domLoaded);
document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', app.nav);
})

function domLoaded(e) { //איתחול הכפתורים של הפוסטים
    document.querySelector('#show-Posts').addEventListener('click', onShowPostsClick);
    document.querySelector('#create-post').addEventListener('click', createPost);
    document.querySelector('#save-comment').addEventListener('click', createComment);

    var comment = document.getElementById("addcomment");

    // Get the button that opens the modal
    var btnaddcomment = document.getElementById("add-comment");

    btnaddcomment.onclick = function () {
        if (!userid) {
            alert("As a guest, you are not authorized to add a comment. Please sign up properly.");
            return;
        }
        document.getElementById("comment-text").value = "";
        comment.style.display = "block";
    }

    // Get the <span> element that closes the modal
    var close = document.getElementById("close-commment");
    // When the user clicks on <span> (x), close the modal
    close.onclick = function () {
        comment.style.display = "none";
    }
}

function onShowPostsClick() {
    getPostsFromServer(1);
}
//הבאת כל הפוסטים מהשרת
function getPostsFromServer(page) {
    let xhr = new XMLHttpRequest();
    currentPage = page;
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            numPages = Number(xhr.getResponseHeader('X-Pagination-Pages'));
            numPosts = Number(xhr.getResponseHeader('X-Pagination-Total'));
            displayPosts(result);
        }
    })
    xhr.open('GET', 'https://gorest.co.in/public/v2/posts?access-token=' + token + '&page=' + page)
    xhr.send();
}

function displayPosts(posts) {// מעבר בין העמודים של הפוסטים ופתיחת הפוסט
    let postList = document.querySelector('#post-data')
    let strToAppendToList = ``;
    posts.forEach(post => {
        strToAppendToList += `<li  style="cursor: pointer;"><a  onclick=getPostFromServer(${post.id})>${post.title}</a></li>`; //בלחיצה על פוסט- פותח אותו
    });
    if (currentPage >= 1 && currentPage <= numPages) {
        postList.innerHTML = strToAppendToList;
        postList.innerHTML += "<button type='button' onclick='getPostsFromServer(currentPage - 1)'><<</button> ";
        let n = (5 * Math.floor(currentPage / 5));
        for (let i = n; i <= n + 5 && i <= numPages; i++) {
            if (i > 0) {
                //לוחצים על העמוד ונותן אותו ומדגיש
                if (i == currentPage) { postList.innerHTML += "<button type='button' onclick='getPostsFromServer(" + i + ")'><b>" + i + "</b></button>"; } else { postList.innerHTML += "<button type='button' onclick='getPostsFromServer(" + i + ")'>" + i + "</button>"; }
            }
        }

        postList.innerHTML += " <button type='button' onclick='getPostsFromServer(currentPage + 1)'>>></button>";
        postList.innerHTML += "<br>";
        postList.innerHTML += "there are " + numPosts + " Posts, " + numPages + " pages";
    }
    if (currentPage < 1)
        currentPage = 1;
    if (currentPage > numPages)
        currentPage = numPages;
}

function createPost() {
    if (!userid) {
        alert("As a guest, you are not authorized to add a post. Please sign up properly.");
        return;
    }
    let title = document.getElementById('title').value;
    let body = document.getElementById('body').value;
    if (!title) {
        alert("Please enter title");
        return;
    }
    if (!body) {
        alert("Please enter body");
        return;
    }
    let newPost = {
        title: title,
        body: body,
        user_id: userid
    }
    //בדיקה שהפוסט נוסף
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 201) {
            alert("The post has been added!");
            document.getElementById('title').value = "";
            document.getElementById('body').value = "";
        }
    })
    xhr.open('POST', 'https://gorest.co.in/public/v2/posts?access-token=' + token); //שמירת הפוסט
    xhr.setRequestHeader("Content-Type", 'application/json');
    xhr.send(JSON.stringify(newPost));
}

function checkForMorePosts(xhr) {//בודק שכל הפוסטים נימצאים
    const numPages = Number(xhr.getResponseHeader('X-Pagination-Pages'));
    const currentPage = Number(xhr.getResponseHeader('X-Pagination-Page'));
    if (currentPage < numPages) {
        getPostsFromServer(currentPage + 1);
    }
}