postid = null;

function getPostFromServer(post_id) {//נותן את הפוסט שעליו לחצנו
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            displayPost(result);
        }
    })
    xhr.open('GET', 'https://gorest.co.in/public/v2/posts/' + post_id + '?access-token=' + token)
    xhr.send();
}

function displayPost(single_post) {//כשנכנסים לתוך הפוסט
    let post_title = document.querySelector('#post-title');
    let post_body = document.querySelector('#post-body');
    post_title.innerHTML = "<b>" + `${single_post.title}` + "</b><br>"; //מביא את הכותרת
    post_body.innerHTML = `${single_post.body}`; //מביא את גוף המאמר
    document.getElementById("posts").classList.remove('active'); //מסתיר עמוד של פוסטים
    let currentPage = document.getElementById('single_post');
    document.getElementById('single_post').classList.add('active'); //מציג עמוד של פוסט בודד
    history.pushState({}, currentPage, `#${currentPage}`); //שומר דף בהסטוריה בשביל החיצים אחרונה וקדימה
    getUserName(`${single_post.user_id}`);//מביא את השם של כותב המאמר
    getCommentsFromServer(`${single_post.id}`);//מביא את ההערות של הפוסט
}
//חיפוש שם של משתמש לפי ID
function getUserName(user_id) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            document.querySelector('#post-username').innerHTML = "By: " + result.name + "";//מביא את השם של כותב המאמר
        } else {
            document.querySelector('#post-username').innerHTML = "By: Unknown";
        }
    })
    xhr.open('GET', 'https://gorest.co.in/public/v2/users/' + user_id + '?access-token=' + token)
    xhr.send();
}

function getCommentsFromServer(post_id) {//מחפש בשרת את התגובות
    let xhr = new XMLHttpRequest();
    postid = post_id;
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            displaycomments(result);
        }
    })
    xhr.open('GET', 'https://gorest.co.in/public/v2/comments?post_id=' + post_id + '&access-token=' + token)
    xhr.send();
}

function displaycomments(comments) { //מציג את כל ההערות
    let post_comments = document.querySelector('#post-comments');
    let strToAppend = `<u>comments:</u><br>`;
    comments.forEach(comment => {
        strToAppend += `<li>${comment.name}: ${comment.body}</li>`;
    });
    post_comments.innerHTML = strToAppend;
}

function createComment() {
    let body = document.getElementById('comment-text').value;
    let newComment = {
        body: body,
        post_id: postid,
        name: curr_user.name,
        email: curr_user.email
    }
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 201) {
            getCommentsFromServer(postid);
            document.getElementById("addcomment").style.display = "none";
        }
    })
    xhr.open('POST', 'https://gorest.co.in/public/v2/comments?access-token=' + token);
    xhr.setRequestHeader("Content-Type", 'application/json');
    xhr.send(JSON.stringify(newComment));
}