document.addEventListener('DOMContentLoaded', domLoaded);

function domLoaded(e) {
    document.querySelector('#create-todo').addEventListener('click', createtodo);
    document.querySelector('#update-todo').addEventListener('click', updatetodo);
    document.querySelector('#delete-todo').addEventListener('click', deletetodo);
    var modal = document.getElementById("myModal");
    // Get the button that opens the modal
    var btn = document.getElementById("AddNewTask");

    btn.onclick = function () {//פותח את החלון של המשימות
        if (!userid) {
            alert("As a guest, you are not authorized to add a task. Please sign up properly.");
            return;
        }
        modal.style.display = "block";
        document.getElementById("update-todo").style.display = "none";
        document.getElementById("delete-todo").style.display = "none";
        document.getElementById("create-todo").style.display = "block";
        document.getElementById("do-title").value = "";
    }

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function gettodosFromServer(page) {//מביא את המשימות מהשרת
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            displayTodos(result);
            checkForMoretodos(xhr);
        }
    })
    xhr.open('GET', 'https://gorest.co.in/public/v2/todos?user_id=' + userid + '&access-token=' + token)
    xhr.send();
}
let d;

function displayTodos(todos) {
    let todoList = document.querySelector('#todo-data')
    todoList.innerHTML = '';
    let strToAppendToList = ``;
    if (todos.length == 0) { strToAppendToList = 'No tasks to do.'; }
    todos.forEach(todo => {
        d = (`${todo.due_on}`); //תאריך יעד
        d = d.split("T")[0]; //לוקח רק את התאריך בלי השעה
        if (`${todo.status}` == "pending") { strToAppendToList += `<li style="cursor: pointer;" < class="edit" id=${todo.id} data-value=` + d + ` > ${todo.title}</li>`; } else { strToAppendToList += `<li style="cursor: pointer;"< class="done" id=${todo.id} data-value=` + d + ` > ${todo.title}</li>`; }
    });
    todoList.innerHTML += strToAppendToList;
    onclickTodos(); //
}

function createtodo() {
    let title = document.getElementById('do-title').value;
    let dodate = document.getElementById('do-date').value;
    let status = document.getElementById('do-status').value;
    if (!title) {
        alert("Please enter title");
        return;
    }
    if (!dodate) {
        alert("Please enter date");
        return;
    }
    let newtodo = {
        title: title,
        user_id: userid,
        due_on: dodate,
        status: status
    }
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 201) {
            gettodosFromServer(1);
            document.getElementById("myModal").style.display = "none"; //להסתיר חלון עדכון
            document.getElementById('do-status').value = "pending"; //לאפס לברירת מחדל
            document.getElementById('do-date').value = ""; //לאפס
        }
    })
    xhr.open('POST', 'https://gorest.co.in/public/v2/todos?access-token=' + token);
    xhr.setRequestHeader("Content-Type", 'application/json');
    xhr.send(JSON.stringify(newtodo));
}

function updatetodo() {
    let title = document.getElementById('do-title').value;
    let dodate = document.getElementById('do-date').value;
    let status = document.getElementById('do-status').value;
    let id = document.getElementById('do-id').value;
    let todo = {
        title: title,
        due_on: dodate,
        status: status
    }
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert("The post has been updated!");
            gettodosFromServer(1);
            document.getElementById("myModal").style.display = "none";
        }
    })
    xhr.open('PUT', 'https://gorest.co.in/public/v2/todos/' + id + '?access-token=' + token);
    xhr.setRequestHeader("Content-Type", 'application/json');
    xhr.send(JSON.stringify(todo));
}

function deletetodo() {
    let text = "Are you sure you want delete this task?";
    if (confirm(text) == true) {
        let id = document.getElementById('do-id').value;
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState == 4 && xhr.status == 204) {
                gettodosFromServer(1);
                document.getElementById("myModal").style.display = "none";
            }
        })
        xhr.open('DELETE', 'https://gorest.co.in/public/v2/todos/' + id + '?access-token=' + token);
        xhr.setRequestHeader("Content-Type", 'application/json');
        xhr.send();
    }
}

function checkForMoretodos(xhr) {
    const numPages = Number(xhr.getResponseHeader('X-Pagination-Pages'));
    const currentPage = Number(xhr.getResponseHeader('X-Pagination-Page'));
    if (currentPage < numPages) {
        gettodosFromServer(currentPage + 1);
    }
}

function onclickTodos() {
    var items = document.querySelectorAll("#todo-data li"),
        inputText = document.getElementById("do-title"),
        inputId = document.getElementById("do-id"),
        dodate = document.getElementById("do-date"),
        dostatus = document.getElementById("do-status"),
        tab = [],
        liIndex;
    // populate tab with li value
    for (var i = 0; i < items.length; i++) {
        tab.push(items[i].innerHTML);
    }
    // get selected li into text fields and get the index   
    for (var i = 0; i < items.length; i++) {
        items[i].onclick = function () {
            liIndex = this.id;
            inputText.value = this.innerHTML.trim(); //TITLE המטלה עצמה
            inputId.value = liIndex;
            var d = new Date(this.dataset.value); //תאריך
            if (this.className == "done") { dostatus.value = "completed"; } else { dostatus.value = "pending"; }
            document.getElementById("do-date").valueAsDate = d;
            document.getElementById("myModal").style.display = "block"; //הצגת המטלה לעדכון
            //הצגת הכפתורים עידכון ומחיקה
            document.getElementById("update-todo").style.display = "block";
            document.getElementById("delete-todo").style.display = "block";
            document.getElementById("create-todo").style.display = "none"; // create הסתרת כפתור 
        };
    }
}