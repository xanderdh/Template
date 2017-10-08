;(function () {
    function autoFooter() {
        if ($('.js-footer').length) {
            const wrapper = $('.wrapper'),
                footer = $('.js-footer'),
                footerHeight = footer.outerHeight();
            footer.css('margin-top', -footerHeight);
            wrapper.css('padding-bottom', footerHeight);
        }
    }

    setTimeout( ()=>{autoFooter()},100 );

    $(window).on('resize', function () {
        autoFooter();
    })
}());
