function getTransform(obj) {
  var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform")    ||
      obj.css("-ms-transform")     ||
      obj.css("-o-transform")      ||
      obj.css("transform"),
      angle,
      x,
      y;

  if(matrix !== 'none') {
    var values = matrix.split('(')[1].split(')')[0].split(',');
    var a      = values[0];
    var b      = values[1];

    angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

    x = parseFloat(values[4]);
    y = parseFloat(values[5]);

  } else {
    angle = 0;
    x     = 0;
    y     = 0;
  }

  return {
    angle : angle,
    x     : x,
    y     : y
  };
}

//Animation background

function translate(param) {
  var $wrap     = $(param.objectsParrent),
      wrapW     = $wrap.innerWidth(),
      wrapH     = $wrap.innerHeight(),
      CenterX   = wrapW/2,
      CenterY   = wrapH/2;

  $(window).resize(function () {
    param.objects.forEach(function(el) {
      $(el.selector).each(function () {
        $(this).css({
          'transform'  : 'none',
          'transition' : 'none'
        });
      });
    });
  });

  function init(x, y) {
    param.objects.forEach(function(el) {
      $(el.selector).each(function () {
        if (window.matchMedia('(min-width: ' + param.mediaTo + 'px)').matches) {
          translateX = el.maxTranslate * x;
          translateY = el.maxTranslate * y;

          $(this).css({
            'transform'  : 'translate(' + translateX + 'px, ' + translateY + 'px)',
            'transition' : '.1s'
          });
        } else {
          $(this).css({
            'transform'  : 'none',
            'transition' : 'none'
          });
        }
      });
    });
  }

  init(0, 0);

  $wrap.on('mousemove', function (el) {
    var cursorX = el.clientX,
        cursorY = el.clientY,
        x = -(cursorX - CenterX) / CenterX,
        y = -(cursorY - CenterY) / CenterY;
    init(x, y);
  });
}
//
// function translate(tObjectParrent, tObject, startPos, tMax) {
//   var tOp = $(tObjectParrent),
//       wrapW = tOp.innerWidth(),
//       wrapH = tOp.innerHeight(),
//       CenterX = wrapW/2,
//       CenterY = wrapH/2,
//       OffsetX = CenterX,
//       OffsetY = CenterY,
//       transX,
//       transY,
//       top,
//       left,
//       windowScrollTop;
//
//   function init(x,y) {
//     var initX = x === 'undefined' ? 1 : x,
//         initY = y === 'undefined' ? 1 : y;
//     for (var i = 0; i < tObject.length; i++) {
//       transX = tObject[i][1]/tMax;
//       transY = tObject[i][1]/tMax;
//       top = 'translateY(calc('+ startPos[1] + ' + ' + initY*transY + 'px))';
//       left = 'translateX(calc(' + startPos[0] + ' + ' + initX*transX + 'px))';
//
//       $(tObject[i][0]).css({
//         'transform' : top + ' ' + left
//       });
//     }
//   }
//
//   init();
//
//   $(window).on('scroll', function () {
//     windowScrollTop = $(this).scrollTop();
//   });
//
//   if (window.matchMedia('(min-width: 992px)').matches) {
//     tOp.on('mouseenter', function (el) {
//       var elemLeft = 0,
//           elemTop = 0;
//
//       if (tObjectParrent !== window) {
//         var pos = $(this).offset();
//
//         elemLeft = pos.left;
//         elemTop = pos.top;
//       }
//
//       if (windowScrollTop >= elemTop && windowScrollTop <= elemTop + wrapH) {
//         tOp.on('mousemove', function (el) {
//             var cursorX = el.clientX - elemLeft,
//                 cursorY = el.clientY - elemTop,
//                 x = -(cursorX - CenterX) / OffsetX * tMax,
//                 y = -(cursorY - CenterY) / OffsetY * tMax;
//
//             init(x, y);
//         });
//       } else {
//         tOp.off('mousemove');
//       }
//     });
//
//     tOp.on('mouseleave', function() {
//       init();
//       tOp.off('mousemove');
//     });
//   }
// }

//Fixed object

function fixPosition(parrentObject, object, offsetTop, offsetBottom) {
  var $object = $(object),
      $parrentObject = $(parrentObject),
      objOffsetY = $object.position().top,
      // objOffsetX,
      objHeight,
      objWidth,
      pObjOffsetY,
      pObjHeight,
      scrollHeight,
      startFixed,
      endFixed;

  function computedVars() {
    // objOffsetX = $object.offset().left;
    objHeight = $object.outerHeight();
    objWidth = $object.outerWidth();
    pObjOffsetY = $parrentObject.offset().top;
    pObjHeight = $parrentObject.outerHeight();
    scrollHeight = $(window).scrollTop() + offsetTop;
    startFixed = pObjOffsetY + objOffsetY;
    endFixed = pObjOffsetY + pObjHeight - objHeight - offsetBottom;
  }

  function fixPositionInit() {
    if (window.matchMedia('(min-width: 992px)').matches) {
      computedVars();

      if(scrollHeight > startFixed && scrollHeight < endFixed){
        $object.attr('style', '');
        $object.css({
          'position' : 'relative',
          'top' : scrollHeight - pObjOffsetY - objOffsetY + 'px'
        });
      } else if(scrollHeight > endFixed){
        $object.attr('style', '');
        $object.css({
          'position' : 'relative',
          'top' : pObjHeight - objOffsetY - objHeight - offsetBottom + 'px'
        });
      }
    } else {
      $object.attr('style', '');
    }
  }

  $(window).load(function() {
    fixPositionInit();
  });

  $(window).resize(function(){
    fixPositionInit();
  });

  $(window).scroll(function() {
    if (window.matchMedia('(min-width: 992px)').matches) {
      computedVars();

      if(scrollHeight > startFixed && scrollHeight < endFixed){
        $object.attr('style', '');
        $object.css({
          'position' : 'fixed',
          'top' : offsetTop + 'px',
          // 'left' : objOffsetX + 'px',
          'width' : objWidth + 'px'
        });
      } else if(scrollHeight >= endFixed){
        $object.attr('style', '');
        $object.css({
          'position' : 'relative',
          'top' : pObjHeight - objOffsetY - objHeight - offsetBottom + 'px'
        });
      } else if(scrollHeight <= startFixed) {
        $object.attr('style', '');
        $object.css({
          'position' : 'relative',
          'top' : 0 + 'px'
        });
      }
    } else {
      $object.attr('style', '');
    }
  });
}

$(document).ready(function() {

  //Logo animation start

  $(window).load(function() {
    $('#COAX_Software').addClass('logo_start');
    $('#COAX_Software').mouseover(function() {
      $('#COAX_Software').removeClass('logo_start').addClass('logo_hover');
    });
  });

  //Header nav

  if ($('body').hasClass('index') === true) {
    $(window).scroll(function() {
      if($(window).scrollTop() > 0){
        $('header').addClass('header_lighten');
      } else{
        $('header').removeClass('header_lighten');
      }
    });
  }

  $('body:not(.get_estimation) header').hover(function() {
    if (window.matchMedia('(min-width: 1200px)').matches) {
      $('body').css('overflow-y', 'hidden');
    }
  }, function() {
    if (window.matchMedia('(min-width: 1200px)').matches) {
      $('body').css('overflow-y', 'auto');
    }
  });

  $('header .hamburger_menu').click(function () {
    if ($(this).hasClass('is-active')) {
      $(this).removeClass('is-active');
      if($(window).scrollTop() === 0){
        $('header').removeClass('header_lighten');
      }
      $('body').css('overflow-y', 'auto');
    } else {
      $(this).addClass('is-active');
      $('header').addClass('header_lighten');
      $('body').css('overflow-y', 'hidden');
    }
  });

  $('body.career .photo_item').focus(function() {
    $('body').css('overflow-y', 'hidden');
  }).focusout(function() {
    $('body').css('overflow-y', 'auto');
  });

  $('header nav li.drop_down').hover(function() {
    if (window.matchMedia('(min-width: 1200px)').matches) {
      $('header .menu_l1 > *').removeClass('menu_l1-active');
      $('header .menu_l2 > *').removeClass('menu_l2-active');

      $('header .menu_l2').css('height', $('header .menu_l2 > *:first-child').height() + 'px');
      $('header .menu_l1 > a:first-child').addClass('menu_l1-active');
      $('header .menu_l2 > *:first-child').addClass('menu_l2-active');

      $('.overlay').toggleClass('show');
    }
  }, function() {
    if (window.matchMedia('(min-width: 1200px)').matches) {
      $('.overlay').toggleClass('show');
    }
  });

  $('header .menu_l1 > a').mouseover(function() {
    if (window.matchMedia('(min-width: 1200px)').matches) {
      $('header .menu_l1 > *').removeClass('menu_l1-active');
      $('header .menu_l2 > *').removeClass('menu_l2-active');

      var eNumber = $($(this)).index() + 1,
          eHeight = $('header .menu_l2 > *:nth-child(' + eNumber + ')').height();

      $($(this)).addClass('menu_l1-active');
      $('header .menu_l2').css('height', eHeight + 'px');
      $('header .menu_l2 > *:nth-child(' + eNumber+ ')').addClass('menu_l2-active');
    }
  });

  $(window).resize(function(){
    if (window.matchMedia('(min-width: 1200px)').matches) {
      $('header .menu_l2').css('height', $('.menu_l2-active').height() + 'px');
    }
  });

  //Animation .index top-bg
  // translate(window, [['#oval-level_1',20],['#oval-level_2',30],['#oval-level_3',40],['#oval-level_4',50]], ['-50%','-50%'], 20);

  translate({
    mediaTo        : 767,
    objectsParrent : window,
    objects : [
      {
        selector     : '#oval-level_1',
        maxTranslate : 20
      },
      {
        selector     : '#oval-level_2',
        maxTranslate : 30
      },
      {
        selector     : '#oval-level_3',
        maxTranslate : 40
      },
      {
        selector     : '#oval-level_4',
        maxTranslate : 50
      }
    ]
  });

  //Estimation link to back

  $("a[href$='get_estimation.html']").click(function() {
    localStorage.setItem('backUrl', location.href);
  });

  $("header a[href$='index.html']").attr('href', localStorage.getItem('backUrl'));

  //Tabs Slider

  $('.tabs_slider .tab_item').click(function() {
    $('.' + $(this).attr('class')).removeAttr('name');
    $(this).attr('name', 'active').removeAttr('style');
  });

  //Slider

  var $slides          = $('.slider .content'),
      slidesLength     = $slides.length - 1,
      activeSlideIndex = $(".slider .content[slide='active']").index(),
      slidesOffset     = 0,
      overlay          = 90;

  slidesOffset += (overlay - 100) * activeSlideIndex;
  for (var i = 0; i <= slidesLength; i++) {
    var overlayPercent = -overlay*i;

    $($slides[i]).css('transform', 'translateX(' + (overlayPercent + slidesOffset) + '%)');
  }

  $(".slider [class^='arrow']").click(function() {
    var $slides          = $('.slider .content'),
        slidesLength     = $slides.length - 1,
        activeSlideIndex = $(".slider .content[slide='active']").index(),
        slidesOffset     = 0,
        overlay          = 90;

    if ($(this).hasClass('arrow-left')) {activeSlideIndex += -1;}
    if ($(this).hasClass('arrow-right')) {activeSlideIndex += 1;}
    if (activeSlideIndex > slidesLength) {activeSlideIndex = 0;}
    if (activeSlideIndex < 0) {activeSlideIndex = slidesLength;}

    $slides.removeAttr('slide');
    $($slides[activeSlideIndex]).attr('slide', 'active');

    slidesOffset += (overlay - 100) * activeSlideIndex;

    for (var i = 0; i <= slidesLength; i++) {
      var overlayPercent = -overlay*i;

      $($slides[i]).css('transform', 'translateX(' + (overlayPercent + slidesOffset) + '%)');
    }
  });

  //Fixed Position Get Estimation

  if ($('body').hasClass('technology_page') === true || $('body').hasClass('technologies') === true) {
    fixPosition('.content_wrap','.get_our_media_kit-side', 160 , 80);
  }

  else if ($('body').hasClass('blog-body')) {
    fixPosition('.content_wrap','.get_our_media_kit-side', 160 , 0);
  }

  //Photo View

  $('body.career .photo_item').focus(function() {
    $('body.career .view').attr('style', $(this).attr('style'));
  });

  $('form').submit(function(e) {
    e.preventDefault();
  });
  //Email
  function infopack(form) {
    var $form        = $(form),
        $btnSubmit   = $form.find(':submit'),
        btnSubmitVal = $btnSubmit.val(),
        $inputEmail  = $form.find('[type=email]');


  $btnSubmit.click(function(){
    var mail = $inputEmail.val();
    var fail =/^[A-Za-z0-9_\-]+(\.[A-Za-z0-9_\-]+)*@[A-Za-z0-9]+((\-|\.)[A-Za-z0-9]+)*(\.[A-Za-z]{2,6})$/;

    if(fail.test(mail)){
      $.ajax({
        type: 'POST',
        url: '/inc/mail.php',
        data: {
          mail: mail
        },
        success:function(data){
          $inputEmail.val('');
          $btnSubmit
            .val('Done!')
            .css('background-color', 'hsl(95, 70%, 40%)');
        },
        error:function(){
          $btnSubmit
            .val('Error! Not Send')
            .css('background-color', '#E61717');
        }
      });
    }

    setTimeout(function() {
      $btnSubmit
        .val(btnSubmitVal)
        .removeAttr('style');
    }, 1500);
  });
}

  infopack('#media-kit-form');

  function mail(type ,form, onSuccess, onError) {
    var $form        = $(form),
        $btnSubmit   = $form.find(':submit'),
        btnSubmitVal = $btnSubmit.val(),
        $inputEmail  = $('input[name=formEmail]');

    var url = type === 'estimation' ? '/inc/form.php' : type === 'message' ? '/inc/form-message.php' : '/inc/form-message.php';

    onSuccess = typeof onSuccess === 'function' ? onSuccess : function () {};
    onError = typeof onError === 'function' ? onError : function () {};

    $btnSubmit.click(function(){
      var mail = $inputEmail.val(),
          fail =/^[A-Za-z0-9_\-]+(\.[A-Za-z0-9_\-]+)*@[A-Za-z0-9]+((\-|\.)[A-Za-z0-9]+)*(\.[A-Za-z]{2,6})$/;

      if(fail.test(mail)){
        $.ajax({
          type: 'POST',
          url: url,
          data: $form.serialize(),
          success:function(data){
            $btnSubmit
              .val('Done!')
              .css('background-color', 'hsl(95, 70%, 40%)');
            fbq('track', 'Lead');
            setTimeout(function() {
              onSuccess();
            }, 1500);
          },
          error:function(){
            $btnSubmit
              .val('Error! Not Send')
              .css('background-color', '#E61717');
            setTimeout(function() {
              onError();
            }, 1500);
          }
        });
      }

      setTimeout(function() {
        $btnSubmit
          .val(btnSubmitVal)
          .removeAttr('style');
      }, 1500);
    });
  }

  mail('estimation', '.get_estimation form', function () {
    window.location.replace('/thank_you_page.html');
  });
  mail('message', '.send_msg');

  function formValid() {
    $("form :submit").click(function() {
      var $btnSubmit   = $(this),
          $form        = $btnSubmit.parents('form'),
          btnSubmitVal = $btnSubmit.val();

      $form.validate({
        // errorPlacement: function(error,element) {
        //   return true;
        // }
      });

      if($form.valid() === false) {
        $btnSubmit
          .val('Oops!')
          .css('background-color', '#E61717');
      }

      setTimeout(function() {
        $btnSubmit
          .val(btnSubmitVal)
          .removeAttr('style');
      }, 1500);
    });
  }

  formValid();

  // Blog like animation

  $('.blog_post-like button').on('click', function() {
    $(this).addClass('active');
    setTimeout(function(){
      $('.blog_post-like button').removeClass('active');
    },1000);
  });

  // Showcase slider

  $('.mobile-app-slider, .mobile-app-titles-slider').owlCarousel({
    items: 1,
    margin: 80,

    responsive: {
      1200: {
        items: 4,
        center: true,
        autoWidth: true
      }
    }
  });

  $('.owl-item').on('click', function(e) {
    var n = $(this).index();
    var thisParrent = $(this).closest('.coax-owl-theme').data('class');

    $('.' + thisParrent).trigger('to.owl.carousel', n);
  });

});
