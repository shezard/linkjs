window.onload = function() {

  // Dummy example

  // Setup linkjs
  linkjs({ 
    // Set global context to {a:1}
    context : {a:1},
    // Define accessible funcs
    funcs : {
      'demo' : function(a,next) {
        console.log('demo says: '+a);
        if(a === '1') {
          if (next) setTimeout(function(){next({a:'1'})},1000);
        } else {
          if(next) setTimeout(function(){next()},1000);
        }
      },
      'sum' : function(a,b,c,next) {
        console.log('sum is: '+(a+b+c));
        if(next) setTimeout(function(){next()},1000);
      }
    }
  }).demo('first').sum(1,1,1).demo('last').reverse().sum(1,2,3).demo('1').demo('2').demo('3').sum(222,222,222).cb();
  
  // Examples with Raphael.js, enabling chained animations
  
  var paper = new Raphael(document.getElementById('canvas_container'), 800, 800);
  
  var circle = paper.circle(50,50,30).attr({'stroke':'none','fill':'rgb(0,255,0)'});
  var rect = paper.rect(100,100,50,50).attr({'stroke':'none','fill':'rgb(0,255,0)'});
  
  var circle2 = paper.circle(50,100,30);
  var rect2 = paper.rect(100,50,30,30);
  
  var circle3 = paper.circle(150,100,30);
  var rect3 = paper.rect(100,150,30,30);
  
  var circle4 = paper.circle(300,300,10);
  
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
  }).rotate(-45).transform('r-45s2 2').rotate(90).rgba(255,0,255,.5).rotate(-360).cb();
  
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
        if(next) next();
      },
      total : function(next) {
        console.log('called '+this.count+' '+this.pluralize('time',this.count));
        if(next) next();
      }
    }
  }).incr().incr().total().cb().total().incr().reverse();
  
  // Changing the context for the next chain (the shapes may or may not be synced)
  
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
  }).animate({transform:'s2 2'}).animate({transform:'s.5 .5'}).cb(circle2).animate({transform:'s2 2'}).animate({transform:'s.5 .5'}).cb();
  
  // And how to avoid it
  
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
  }).animate({transform:'s2 2'}).animate({transform:'s.5 .5'}).cb();
  
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
};