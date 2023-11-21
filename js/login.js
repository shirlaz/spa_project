userid = null;
const curr_user = {
    email: "",
    pass: "",
    userid: "",
    name: "",
    last_page: "main"
}

function domLoaded(e) { //המעבר בין הלוג אין לסיין אפ
    const SignUpLoginForm = document.getElementById("SignUpLogin");
    const HomeForm = document.getElementById("Home");
    const switchers = [...document.querySelectorAll('.switcher')]

    switchers.forEach(item => {
        item.addEventListener('click', function () {
            switchers.forEach(item => item.parentElement.classList.remove('is-active'))
            this.parentElement.classList.add('is-active')
        })
    })
}
document.addEventListener('DOMContentLoaded', domLoaded);

function signUp() {
    let fname = document.getElementById("Fname").value;
    let lname = document.getElementById("Lname").value;
    let gender = document.getElementById("Gender").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    userid = "1";

    let userData = {
        id: userid,
        status: "active",
        name: fname + ' ' + lname,
        gender: gender,
        email: email
    }

    curr_user.email = email;
    curr_user.pass = password;
    curr_user.userid = userid;
    curr_user.name = fname + ' ' + lname;

    let xhr = new XMLHttpRequest(); //האובייקט שאיתו פונים לשרת
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == 4 && xhr.status == 201) { //בדיקה שהכניסה הצליחה
            let result = JSON.parse(xhr.responseText);
            userid = result.id;
            curr_user.userid = userid;
            window.localStorage.setItem(email, JSON.stringify(curr_user));
            afterlogin(result.name);
            //איפוס השדות
            document.getElementById("Fname").value = "";
            document.getElementById("Lname").value = "";
            document.getElementById("Gender").value = "";
            document.getElementById("signup-email").value = "";
            document.getElementById("signup-password").value = "";
        }
    })
    //התחברות לשרת
    xhr.open('POST', 'https://gorest.co.in/public/v2/users?access-token=' + token); //פותח קשר עם השרת
    xhr.setRequestHeader("Content-Type", 'application/json'); // json מתקשר עם 
    xhr.send(JSON.stringify(userData)); //שולח נתונים לשרת
}

function LogIn() {
    let email = document.getElementById("log-email").value;
    let pass = document.getElementById("log-pass").value;
    let LogInUser = window.localStorage.getItem(email); //שליפת האימייל מהלוקל סטורג

    if (LogInUser) //אם המשתמש קיים
        if (JSON.parse(LogInUser).pass == pass) {
            userid = JSON.parse(LogInUser).userid;
            curr_user.name = JSON.parse(LogInUser).name;
            curr_user.pass = JSON.parse(LogInUser).pass;
            curr_user.email = JSON.parse(LogInUser).email;
            curr_user.userid = userid;
            curr_user.last_page = JSON.parse(LogInUser).last_page;
            afterlogin(JSON.parse(LogInUser).name);
            //איפוס האימייל והסיסמה למשתמש הבא
            document.getElementById("log-email").value = "";
            document.getElementById("log-pass").value = "";
        }

    if (!userid)
        alert("wrong user or password");
    return false;
}

function afterlogin(name) {
    alert("Hello: " + name);
    const SignUpLoginForm = document.getElementById("SignUpLogin");
    const HomeForm = document.getElementById("Home");
    SignUpLoginForm.classList.remove('active'); //מסתיר את הדף של הלוג אין והסיין אפ
    HomeForm.classList.add('active'); //מפעיל את דף הבית
    gettodosFromServer(1);
    let greeting = document.getElementById('greeting');
    greeting.innerHTML = "    Wellcome " + name + ",";
    let page;
    page = curr_user.last_page;//כשהמשתמש נכנס הוא נותן את הדף האחרון שהיה בו
    // שמירת הדף האחרון
    history.replaceState({}, page, '#' + page);
    // מעבר לדף האחרון של המשתמש
    window.location = "#" + page;
}

function loginguest() {
    afterlogin("Guest");
}

function logout() {
    alert("goodbye");
    const SignUpLoginForm = document.getElementById("SignUpLogin");
    const HomeForm = document.getElementById("Home");
    SignUpLoginForm.classList.add('active');
    HomeForm.classList.remove('active');
    const wrapper_SignUp = document.getElementById("wrapper_SignUp");
    const wrapper_login = document.getElementById("wrapper_login");
    wrapper_SignUp.classList.remove('is-active');
    wrapper_login.classList.add('is-active');
    document.getElementById("log-email").value = "";
    document.getElementById("log-pass").value = "";
    document.getElementById('post-data').innerHTML = ""; //להסתיר פוסטים
    userid = null;
    curr_user.email = "",
        curr_user.pass = "",
        curr_user.userid = "",
        curr_user.name = "",
        curr_user.last_page = "main"
}

function gotoSignUp() {//כשלוחצים על here
    const wrapper_SignUp = document.getElementById("wrapper_SignUp");
    const wrapper_login = document.getElementById("wrapper_login");
    wrapper_login.classList.remove('is-active');
    wrapper_SignUp.classList.add('is-active');
}