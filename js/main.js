const token = '07afaaaa757d426beb601d51a73a569732ee1dbabb291b6481e644534ba2a20f';
const app = {
    pages: [],
    show: new Event('show'),
    init: function () { //איתחול התפריט
        app.pages = document.querySelectorAll('.in-page');
        app.pages.forEach((pg) => {
            pg.addEventListener('show', app.pageShown);
        })
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', app.nav);
        })
        window.addEventListener('popstate', app.poppin);
    },
    //כשמגיעים מהכפתורים של התפריט
    nav: function (ev) { //המעבר בין הדפים- ארבעת הלחצנים
        let currentPage = ev.target.getAttribute('data-target');
        document.getElementById("posts").classList.remove('active');
        document.getElementById("todos").classList.remove('active');
        document.getElementById("main").classList.remove('active');
        document.getElementById("about").classList.remove('active');
        document.getElementById("single_post").classList.remove('active');
        curr_user.last_page = currentPage;
        window.localStorage.setItem(curr_user.email, JSON.stringify(curr_user));
        document.getElementById(currentPage).classList.add('active');
        history.pushState({}, currentPage, `#${currentPage}`); //החץ שעובר בין הדפים
        document.getElementById(currentPage).dispatchEvent(app.show);
    },
    //כשמגיעים ממקום אחר כמו מהחיצים
    poppin: function (ev) { //החץ שעובר בין הדפים
        let hash = location.hash.replace('#', '');
        document.getElementById("posts").classList.remove('active');
        document.getElementById("todos").classList.remove('active');
        document.getElementById("main").classList.remove('active');
        document.getElementById("about").classList.remove('active');
        document.getElementById("single_post").classList.remove('active');
        console.log("1");
        console.log(hash);
        document.getElementById(hash).classList.add('active');
        document.getElementById(hash).dispatchEvent(app.show);
    }
}
document.addEventListener('DOMContentLoaded', app.init);


//localStorage.clear();