$(document).ready(function(){

  function toggle($who) {
    if($who.parent().hasClass('card')) {
      $who.parent().toggleClass('collapsed');
    }
    if($who.parent().parent().hasClass('card')) {
      $who.parent().parent().toggleClass('collapsed');
    }
    $who.parent().find('.collapseme').slideToggle();
  }

  $('.collapsible h3').click(function(){
    toggle($(this));
  });
  $('.collapsible .icon').click(function(){
    toggle($(this));
  });
  $('.toggler').click(function(){
    toggle($(this));
  });

  

  function writeStageUI(activeStage) {
    var title = activeStage.name;

    $('#js-stage-title').html(title).css({color:activeStage.color});

    $('#js-stage-list div').each(function(index){
      var count = index + 1;
      
      if(count < activeStage.number) {
        var current = $(this).html();
        $(this).html('<strike>'+current+'</strike>');
        toggle($('#schedule [data-card="'+count+'"]').find('h3'));
      } else if(count == activeStage.number) {

        if(activeStage.soldOut) {
          $('#schedule [data-card="'+count+'"]').find('.date').prepend('SOLD OUT<br>');
          $(this).append(' <span style="color:'+activeStage.color+'">SOLD OUT!</span>');
          // $('#js-cta').hide();
          $('#js-sold-out-current').html(activeStage.number);
          if(activeStage.number == 3) {
            $('#js-sold-out-next').html('Stage 4');
          }else if(activeStage.number == 4) {
            $('#js-sold-out-next').html('next time');
          } else {
            $('#js-sold-out-next').html('Stages ' + (activeStage.number+1) + '-' + 4);
          }
          
          $('#js-sold-out').show();

        }

      }
      

    });

  }

  function writeTime(days,hours,minutes,seconds) {
    if(seconds.length == 1) {
      $($('.seconds .number')[0]).text('0');
      $($('.seconds .number')[1]).text(seconds);
    } else {
      $($('.seconds .number')[0]).text(seconds.split('')[0]);
      $($('.seconds .number')[1]).text(seconds.split('')[1]);
    }
    if(minutes.length == 1) {
      $($('.minutes .number')[0]).text('0');
      $($('.minutes .number')[1]).text(minutes);
    } else {
      $($('.minutes .number')[0]).text(minutes.split('')[0]);
      $($('.minutes .number')[1]).text(minutes.split('')[1]);
    }
    if(hours.length == 1) {
      $($('.hours .number')[0]).text('0');
      $($('.hours .number')[1]).text(hours);
    } else {
      $($('.hours .number')[0]).text(hours.split('')[0]);
      $($('.hours .number')[1]).text(hours.split('')[1]);
    }
    if(days.length == 1) {
      $($('.days .number')[0]).text('0');
      $($('.days .number')[1]).text(days);
    } else {
      $($('.days .number')[0]).text(days.split('')[0]);
      $($('.days .number')[1]).text(days.split('')[1]);
    }
  }

  function calculateDiff(targetDate) {
    var now = new Date();
    var offset = new Date(targetDate).getTimezoneOffset() - now.getTimezoneOffset(); //timezone diffs in minutes
    var diff = (targetDate - now.getTime())/1000 - offset*60;

    return diff;
   
  }
  
  var activeStage;
  function decideStage(inital) {
    if(calculateDiff(new Date(Date.parse(stages[0].date)).setHours(15)) > 0) {
      activeStage = stages[0];
    } else if(calculateDiff(new Date(Date.parse(stages[1].date)).setHours(15)) > 0) {
      activeStage = stages[1];
    } else if(calculateDiff(new Date(Date.parse(stages[2].date)).setHours(15)) > 0) {
      activeStage = stages[2];
    } else if(calculateDiff(new Date(Date.parse(stages[3].date)).setHours(15)) > 0) {
      activeStage = stages[3];
    } else {
      //over
      activeStage = false;
     
    }

    if(activeStage) {
      var diff = calculateDiff(new Date(Date.parse(activeStage.date)).setHours(15));
      var days = Math.floor(diff/60/60/24);
      var hours = Math.floor(diff/60/60) - 24*days;
      var minutes = Math.floor(diff/60) - 24*days*60 - 60*hours;
      var seconds = Math.floor(diff) - 24*days*60*60 - 60*hours*60 - 60*minutes;
      if(inital) {
        writeStageUI(activeStage);
      }
      
      writeTime(days.toString(),hours.toString(),minutes.toString(),seconds.toString());
    } else {
      //what to do when it is over?
      $('.counter').hide();
      $('.units').hide();
      $('.button').hide();
      $('.hero h2').html('');
      $('.hero').css({minHeight:0,height:'70px'});
    }
    

  }

  decideStage(true);


  window.setInterval(function(){
    var seconds = new Date().getSeconds().toString();
    decideStage();

  },1000);

  function colorHeader(){
    var percent = $(document).scrollTop() / 200;
    if(percent < .95) {
      $('header').css({backgroundColor:'rgba(0,0,0,'+percent+')'});
    } else {
      $('header').css({backgroundColor:'rgba(0,0,0,.95)'});
    }

    var totalPercent = $(document).scrollTop() / $(document).height();
    var windowHeight = $(window).height();
    $('.star').each(function(){
      var marginTop = totalPercent * windowHeight * $(this).width() / maxSize;
      $(this).css({marginTop:-marginTop});
    });
    $('.rocket').each(function(){
      var marginTop = 30  - (3 * totalPercent * windowHeight);
      $(this).css({marginTop:marginTop});
    });
    // $('.lines').each(function(){
    //  var marginTop = -(7 * totalPercent * windowHeight);
    //  $(this).css({marginTop:marginTop});
    // });
  }
  colorHeader();
  $(window).scroll(function(){
    //0, 1 by 200
    colorHeader();
  });

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  var maxSize = 33;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24"><path fill="#1D6097" fill-rule="evenodd" d="M16.663 6.85c.208.547.638.98 1.187 1.188l5.53 2.048a2.046 2.046 0 0 1 1.186 2.64c-.208.546-.64.98-1.187 1.19l-5.53 2.047a2.04 2.04 0 0 0-1.186 1.187l-2.048 5.528a2.048 2.048 0 0 1-3.83 0L8.737 17.15a2.046 2.046 0 0 0-1.187-1.187l-5.527-2.048a2.048 2.048 0 0 1 0-3.83L7.55 8.039c.547-.208.98-.641 1.187-1.187l2.048-5.53a2.047 2.047 0 0 1 3.83 0l2.048 5.53z"/></svg>';
  function makeStars() {
    var $star = $(document.createElement('div')).addClass('star');
    for(var i=0;i<25; i++) {
      var $star = $(document.createElement('div')).addClass('star');

      var randomSize = randomIntFromInterval(7, maxSize);
      var randomY = randomIntFromInterval(0,$(window).height()*2);
      var randomX = randomIntFromInterval(0,$(window).width());

      $star.css({width:randomSize,top:randomY,left:randomX});

      $star.html(svg);
      $('.wrapper').append($star);
    }
  }

  makeStars();

  function toggleMenu() {
    $('body').toggleClass('menu-open');
  }

  $('.open').click(function(e){
    e.preventDefault();
    toggleMenu();
  });
  $('.close').click(function(e){
    e.preventDefault();
    toggleMenu();
  });
  $('.anchor').click(function(){
    $('body').removeClass('menu-open');
  });


});