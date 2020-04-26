/*
    snackbar.js
    © 2016 Rikin Katyal
*/
$.fn.snackbar = function(args) {

    var $this = this;
    var $snackbar = $('<div class="snackbar"></div>');

    $('.snackbar').remove();

    // Options
    var primary,
        accent,
        duration = 1,
        message = "This is a snackbar. (snackbar.js)",
        option = false,
        optionText = "UNDO",
        swipe = false;

    // Set options specified in args
    if (args != undefined) {
        if (args.primary != undefined) {
            primary = args.primary;
        }

        if (args.accent != undefined) {
            accent = args.accent;
        }

        if (args.duration != undefined) {
            duration = args.duration;
        }

        if (args.message != undefined) {
            message = args.message;
        }

        if (args.optionText != undefined) {
            optionText = args.optionText;

            if (optionText.length > 0) {
                option = true;
            }
        }

        if (args.swipe != undefined) {
            swipe = args.swipe;
        }

        if (args.callback == undefined) {
            args.callback = function() {};
        }
        $snackbar.callback = args.callback;
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $snackbar.css({
            "width": "100%",
            "left": "0",
            "bottom": "0"
        });
        swipe = false;
    }

    $message = $('<span class="snackbar-message"></span>');
    $message.text(message);

    if (primary != undefined) {
        $message.css("color", primary);
    }

    $snackbar.append($message);

    if (option) {
        $option = $('<span class="snackbar-option"></span>');
        $option.text(optionText);

        if (accent != undefined) {
            $option.css("color", accent)
        }

        $snackbar.append($option);
    }

    

    $this.append($snackbar);

    // Animate snackbar in
    $snackbar.show("drop", {
        direction: "down"
    }, 300)

    // If swipe to dismiss is false, hide after duration
    if (!swipe) {
        $snackbar.delay(duration * 1000).hide("drop", {
            direction: "down"
        }, 300);
    } else {
        // Setup swipe to dismiss
        var offsetLeft = $($snackbar).offset().left;
        $snackbar.draggable({
            axis: "x",
            start: function(event, ui) {
                startX = event.clientX;
            },
            drag: function(event, ui) {
                if (startX - event.clientX > 100) {
                    $snackbar.css("opacity", 1-(startX - event.clientX - 100)/200);
                }
                if (event.clientX - startX > 100) {
                    $snackbar.css("opacity", 1-(event.clientX - startX - 100)/200);
                }
            },
            stop: function(event, ui) {
                if (startX - event.clientX > 100) {
                    $snackbar.hide("drop", {
                        direction: "left"
                    }, 300);
                }
                if (event.clientX - startX > 100) {
                    $snackbar.hide("drop", {
                        direction: "right"
                    }, 300);
                }
                if (startX - event.clientX < 100) {
                    $(this).animate({
                        left: offsetLeft
                    }, 250);
                    $snackbar.css("opacity", 1);
                }
            }
        })
    }

    if (option) {
        // Setup callback for option click
        $option.click(function() {
            $snackbar.callback();
        });
    }

}


var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    };