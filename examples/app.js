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
  
  // Example with Raphael.js
  
  var paper = new Raphael(document.getElementById('canvas_container'), 800, 800);
  
  var circle = paper.circle(50,50,30).attr({'stroke':'none','fill':'rgb(0,255,0)'});
  
  var rect = paper.rect(100,100,50,50).attr({'stroke':'none','fill':'rgb(0,255,0)'});
  
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
      }
    }
  }).rotate(-45).rotate(90).rotate(-360).cb();
  
};