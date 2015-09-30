/*
 * eu-cookie-law
 * 
 *
 * Copyright (c) 2014 Fernando Gonzalez
 * Licensed under the MIT license.
 */

(function ($) {

    // Static method.
    $.euCookieLaw = function (options) {
        // Override default options with passed-in options.
        $.euCookieLaw.options = $.extend(true, {}, $.euCookieLaw.options, options);
        // In case cookies are not accepted nor declined, show the popup.
        if (!$.euCookieAccepted() || $.euCookieDeclined()) {
            $.euCookieLawShow();
        }
    };

    $.euCookieLawShow = function () {
        var html = $.euCookieLaw.options.template.container.replace('{{message}}', $.euCookieLaw.options.message);
        html = html.replace('{{acceptLink}}', $.euCookieLaw.options.template.acceptLink);
        html = html.replace('{{declineLink}}', $.euCookieLaw.options.template.declineLink);
        html = html.replace('{{readMoreLink}}', $.euCookieLaw.options.template.readMoreLink);
        html = html.replace('{{acceptButtonText}}', $.euCookieLaw.options.acceptButtonText);
        html = html.replace('{{declineButtonText}}', $.euCookieLaw.options.declineButtonText);
        html = html.replace('{{readMoreLink}}', $.euCookieLaw.options.readMoreLink);
        html = html.replace('{{readMoreButtonText}}', $.euCookieLaw.options.readMoreButtonText);
        html = html.replace('{{position}}', $.euCookieLaw.options.position);
        $('body').append(html);
        $('.eu-cookies-accept').click($.euAcceptCookie);
        $('.eu-cookies-decline').click($.euDeclineCookie);
    };

    $.euCookieLawHide = function () {
        jQuery('.eu-cookies-popup').fadeOut();
    };

    $.euAcceptCookie = function () {
        $.cookie($.euCookieLaw.options.cookieDeclineName, null, { path: '/' });
        $.cookie($.euCookieLaw.options.cookieAcceptName, $.euCookieLaw.options.cookieAcceptValue, { expires: $.euCookieLaw.options.cookieExpires, path: '/' });
        $.euCookieLawHide();
    };

    $.euDeclineCookie = function () {
        $.cookie($.euCookieLaw.options.cookieDeclineName, $.euCookieLaw.options.cookieDeclineName, { expires: $.euCookieLaw.options.cookieExpires, path: '/' });
        $.cookie($.euCookieLaw.options.cookieAcceptName, null, { path: '/' });
        $.euRemoveCookies();
        $.euCookieLawHide();
    };

    $.euRemoveCookies = function () {
        jQuery.each($.euCookieLaw.options.cookieNames, function (d) {
            $.cookie(d, null, { domain: '.' + $.euCookieLaw.options.cookieDomain, path: '/' });
        });
    };

    $.euCookieAccepted = function () {
        return $.cookie($.euCookieLaw.options.cookieAcceptName) === $.euCookieLaw.options.cookieAcceptValue;
    };

    $.euCookieDeclined = function () {
        return $.cookie($.euCookieLaw.options.cookieDeclineName) === $.euCookieLaw.options.cookieDeclineName;
    };

    // Static method default options.
    $.euCookieLaw.options = {
        cookieAcceptName: 'eu_cookie_accept',
        cookieAcceptValue: 'accept',
        cookieDeclineName: 'eu_cookie_decline',
        cookieDeclineValue: 'decline',
        cookieExpires: 365,
        template: {
            container: '<div class="eu-cookies-popup {{position}}">{{message}} {{acceptLink}} {{declineLink}} {{readMoreLink}}</div>',
            acceptLink: '<a href="#accept" class="btn btn-success eu-cookies-accept">{{acceptButtonText}}</a>',
            declineLink: '<a href="#decline" class="btn btn-default eu-cookies-decline">{{declineButtonText}}</a>',
            readMoreLink: '<a href="{{readMoreLink}}" class="btn btn-link">{{readMoreButtonText}}</a>'
        },
        message: 'We use cookies on this website. To use the website as intended please...',
        acceptButtonText: 'Accept',
        declineButtonText: 'Decline',
        readMoreButtonText: 'Read More',
        readMoreLink: '',
        position: 'bottom',
        cookieDomain: '',
        cookieNames: ['__utma', '__utmb', '__utmc', '__utmz']
    };

}(jQuery));
