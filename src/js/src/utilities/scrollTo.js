
// Scroll to element or specific top distance
// -- 
var scrollTo = function(s) {
    
    var newYPos = 0;

    if($.isNumeric(s)) {
        newYPos = s;
    } else {
        newYPos = $(s).offset().top;
    }

    $('html, body').animate({ scrollTop: (newYPos || 0) }, 300);

}

export default scrollTo
