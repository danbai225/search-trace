window.db = {
    g: function (name) {
        return document.querySelector(name);
    },
    ga: function (name) {
        return document.querySelectorAll(name);
    },
}