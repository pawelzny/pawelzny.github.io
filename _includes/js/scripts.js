'use strict';

function gaEvent(eventCategory, eventAction, eventLabel) {
    ga('send', 'event', eventCategory, eventAction, eventLabel);
    // ga('send', 'event', 'post', 'read', 'blog');
}

function postEvent(eventLabel) {
    return gaEvent('post', 'read', eventLabel);
}

$(function () {
    $('.postEvent').on('click', function (event) {
        var
            $target = $(event.target),
            title = $target.text();

        postEvent(title);
    });
});
