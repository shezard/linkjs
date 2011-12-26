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
  })//.demo('first').sum(1,1,1).demo('last').reverse().sum(1,2,3).demo('1').demo('2').demo('3').sum(222,222,222).cb();
  
  // Example with Raphael.js
  
  var paper = new Raphael(document.getElementById('canvas_container'), 400, 300);
  
  var circle = paper.circle(50,50,30).attr({'stroke':'none','fill':'rgba(255,0,0,.3)'});
  
  linkjs({
    context : circle,
    funcs: {
      'animate' : function(attr,next) {
        console.log(attr);
        if(next) {
          this.animate(attr,1e3,'easing',function(){next()});
        } else {
          this.animate(attr,1e3,'easing');
        }
      }
    }
  }).animate({'stroke-width':10,'stroke':'#000'}).animate({'stroke-width':5}).cb();
  
};