'use strict';

/**
 * Generic ga event sender
 *
 * @param {String} eventCategory
 * @param {String} eventAction
 * @param {String} eventLabel
 */
function gaEvent(eventCategory, eventAction, eventLabel) {
    if (ga) {
        ga('send', 'event', eventCategory, eventAction, eventLabel);
    }
}

/**
 * Blog post ga event helper
 *
 * @param {String} eventLabel
 */
function postEvent(eventLabel) {
    gaEvent('post', 'read', eventLabel);
}

/**
 * Follow me on social network ga event helper
 *
 * @param {String} eventLabel
 */
function socialEvent(eventLabel) {
    gaEvent('social network', 'click', eventLabel);
}

/**
 * Source code ga event helper
 *
 * @param {any} eventLabel
 */
function sourceEvent(eventLabel) {
    gaEvent('source code', 'click', eventLabel);
}

/**
 * Main execution function.
 */
function main () {
    $('.postEvent').on('click', function (event) {
        var
            $target = $(this),
            title = $target.text();

        postEvent(title);
    });

    $('.sourceEvent').on('click', function (event) {
        var
            $target = $(this),
            title = $target.text();

        sourceEvent(title);
    });

    $('.socialEvent').on('click', function (event) {
        var
            $target = $(this),
            title = $target.data('network');

        socialEvent(title);
    });
}

$(main); // execute main function when document ready.
