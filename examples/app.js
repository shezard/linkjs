window.onload = function() {

  // Dummy example

  // Setup linkjs
  linkjs({ 
    // Set global context to {a:1}
    context : {a:1},
    // Define accessible funcs
    funcs : {
      // Those function now get next, the next function to be called in the chain
      'demo' : function(a,next) {
        console.log('demo says: '+a);
        if(next) setTimeout(function(){next()},1000);
      },
      'sum' : function(a,b,c,next) {
        console.log('sum is: '+(a+b+c));
        if(next) setTimeout(function(){next()},1000);
      }
    }
  // Here you don't specifie next, he's autoloaded base on the callback's chain
  }).sum(1,2,3).demo('1').demo('2').demo('3').sum(111,222,444).cb();
  
  // Example with a context used to store data
  
  linkjs({
    context : {
      pluralize : function(word,num) {
        return word+(num > 1 ? 's' : '');
      }
    },
    funcs : {
      incr : function(next) {
        this.count = this.count + 1 || 1;
        if(next) setTimeout(function(){next()},1000);
      },
      total : function(next) {
        console.log('called '+this.count+': '+this.pluralize('time',this.count));
        if(next) setTimeout(function(){next()},1000);
      }
    }
  }).incr().incr().total().incr().incr().total().cb();
  
  // Example with previous value used in the next function
  
  linkjs({
    funcs : {
      // You can pass stuff to next and the next function will get this as an arg
      // But please be carefull counting the args if the count does not match what your function expect,
      // bad this will happens, and the chain of callbacks will break
      init : function(letter,next) {
        console.log('value init to: '+letter);
        if(next) setTimeout(function(){next(letter)},1000);
      },
      log : function(letter,next) {
        console.log('value was: '+letter);
        if(next) setTimeout(function(){next(letter)},1000);
      }
    }
  }).init('a').log().log().cb();
  
  // Examples with Raphael.js, enabling chained animations
  
  var paper = new Raphael(document.getElementById('canvas_container'), 800, 800);

  // Example 1
  
  paper.text(100,10,"Example 1");
  var circle = paper.circle(100,60,30).attr({'stroke':'none','fill':'rgb(0,255,0)'});
  
  linkjs({
    context : circle,
    funcs: {
      'animate' : function(attr,next) {
        if(next) {
          this.animate(attr,1e3,'easing',function(){next()});
        } else {
          this.animate(attr,1e3,'easing');
        }
      }
    }
  }).animate({'stroke-width':10,'stroke':'#000'}).animate({'stroke-width':5}).animate({'fill':'rgb(255,0,0)'}).cb();
  
  // Example 2
  
  paper.text(225,10,"Example 2");
  var rect = paper.rect(200,30,50,50).attr({'stroke':'none','fill':'rgb(0,255,0)'});
  
  linkjs({
    context : rect,
    funcs : {
      'rotate' : function(angle,next) {
        if(next) {
          this.animate({'transform':'r'+angle},1e3,'easing',function(){next()});
        } else {
          this.animate({'transform':'r'+angle},1e3,'easing');
        }
      },
      'rgba' : function(r,g,b,a,next) {
        if(next) {
          this.animate({'fill':'rgba('+r+','+g+','+b+','+a+')'},1e3,'easing',function(){next()});
        } else {
          this.animate({'fill':'rgba('+r+','+g+','+b+','+a+')'},1e3,'easing');
        }
      },
      'transform' : function(transformation,next) {
        if(next) {
          this.animate({'transform':transformation},1e3,'easing',function(){next()});
        } else {
          this.animate({'transform':transformation},1e3,'easing');
        }
      }
    }
  }).rotate(-45).transform('r-45s.5 .5').rotate(90).rgba(255,0,255,.5).rotate(-360).cb();
  
  // Example 3
  // Changing the context for the next chain (the shapes may or may not be synced)
  
  paper.text(350,10,'Example 3');
  var circle2 = paper.circle(350,60,30);
  var rect2 = paper.rect(330,120,45,45);
  
  linkjs({
    context : rect2,
    funcs : {
      'animate' : function(attr,next) {
        if(next) {
          this.animate(attr,1e3,'easing',function(){next()});
        } else {
          this.animate(attr,1e3,'easing');
        }
      }
    }
  // The first part of the chain is exec with this bind to rect2, after cb(circle2), this is bind to circle2
  }).animate({transform:'s.5 .5'}).animate({transform:'s1 1'}).cb(circle2).animate({transform:'s.5 .5'}).animate({transform:'s1 1'}).cb();
  
  // Example 4
  // And how to avoid it
  
  paper.text(475,10,'Example 4');
  var circle3 = paper.circle(470,60,30);
  var rect3 = paper.rect(450,120,45,45);
  
  linkjs({
    context : {
      shapes : [circle3,rect3]
    },
    funcs : {
      'animate' : function(attr,next) {
        if(next) {
          var l = this.shapes.length;
          for(;l--;) {
            this.shapes[l].animate(attr,1e3,'easing',function(){next()});
          }
        } else {
          var l = this.shapes.length;
          for(;l--;) {
            this.shapes[l].animate(attr,1e3,'easing');
          }
        }
      }
    }
  // Here the shape may or may not be synced
  }).animate({transform:'s.5 .5'}).animate({transform:'s1 1'}).cb();
  
  // Example 5
  // loop aka infinite chain callback
  
  paper.text(600,10,'Example 5');
  var circle4 = paper.circle(600,60,10);
  
  linkjs({
    context : circle4,
    funcs : {
      'animate' : function(attr,next) {
        if(next) {
          this.animate(attr,1e3,'easing',function(){next()});
        } else {
          this.animate(attr,1e3,'easing');
        }
      }
    }
  }).animate({transform:'s3 3'}).animate({transform:'s1 1'}).loop();
   
  // Utilities Example
  // Chain
  
   linkjs({
    funcs : {
      log: function(letter) {
        console.log('chain: '+letter);
      }
    }
  }).log('0').log('1').log('2').log('3').chain();
  
  
  // Reverse
  
  linkjs({
    funcs : {
      log: function(letter) {
        console.log('reverse: '+letter);
      }
    }
  }).log('0').log('1').log('2').log('3').reverse();
  
  // Random
  
  linkjs({
    funcs : {
      log: function(letter) {
        console.log('random: '+letter);
      }
    }
  }).log('0').log('1').log('2').log('3').random();
};