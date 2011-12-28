## linkjs

_linkjs_ is a simple tool to chain callback :

without _linkjs_ : 

```js
var takeTime = function (text,cb) {
  console.log(text);
  if(cb) setTimeout(function(){cb()}, 1000);
};

takeTime('Hello',function(){takeTime('World');});
```
  
with _linkjs_ :

```js
var myLink = linkjs({ 
  funcs : {
    // You get next as the last argument, just call it to have access to the next function in the chain
    takeTime : function(text,next) {
      console.log(text);
      if(next) setTimeout(function(){next()}, 1000);
    }
  }
});

// Here we ask myLink to call takeTime('Hello') with takeTime('World') as next
myLink.takeTime('Hello').takeTime('World').callback();
```

you can also pass some context around :

```javascript
var myLink = linkjs({ 
  // In every funcs, this will be {some:'context'}
  context : {some:'context'},
  funcs : {
    log : function(next) {
      console.log(this);
      if(next) setTimeout(function(){next()}, 1000);
    }
  }
});
```
and use cb as an alias to callback : 

```javascript
myLink.log().log().cb();
```
  
you can also make multiple chain, each call to callback will launch the functions preceding it :

```javascript
var myLink = linkjs({ 
  funcs : {
    takeTime : function(text,next) {
      console.log(text);
      if(next) setTimeout(function(){next()}, 1000);
    }
  }
});

// Here both takeTime('Hello') and takeTime('1') will be launch at the same time
myLink.takeTime('Hello').takeTime('World').cb().takeTime('1').takeTime('2').cb();
```

or even make loops :

```javascript
var myLink = linkjs({ 
  funcs : {
    tick : function(text,next) {
      console.log(text);
      if(next) setTimeout(function(){next()}, 1000);
    }
  }
});

// Here you will log Hello then one second later World then One second later Hello and so on
myLink.tick('Hello').tick('World').loop();
```

and send additionnal params to next :

```javascript
var myLink = linkjs({ 
  funcs : {
    init : function(text,next) {
      // We send text to next
      if(next) setTimeout(function(){next(text)}, 1000);
    },
    // We send text to next
    log : function(text,next) {
      console.log(text += 'o');
      if(next) setTimeout(function(){next(text)},1000);
    }
  }
});

// Now you just need to pass text to init, and log will take it as argument automatically
myLink.init('go').log().log().log().log().cb();
```

## Real life example with Raphael.js

```javascript

var paper = new Raphael(0,0,800,600);

var circ = paper.circle(10,10,30);

var myLink = linkjs({ 
  // we bind this to circ
  context : circ,
  funcs : {
    // a sample animate function
    animate : function(attr,duration,easing,next) {
      if(next) {
        this.animate(attr,duration,easing,function(){next()});
      } else {
        this.animate(attr,duration,easing);
      }
    }
  }
});

// Now you chain animation easily
myLink.animate({'stroke-width':10},1e3,'linear').animate({transform:'s2 2'},1e3,'bounce').cb();
```

## Utilities

chain : 

```javascript
var myLink = linkjs({ 
  funcs : {
    // chain don't use next
    tick : function(text) {
      console.log(text);
    }
  }
});

// Here your funcs will be call in order first tick('World') then tick('Hello');
myLink.tick('Hello').tick('World').chain();
```

reverse :

```javascript
var myLink = linkjs({ 
  funcs : {
    // reverse don't use next
    tick : function(text) {
      console.log(text);
    }
  }
});

// Here your funcs will be call in reverse order first tick('World') then tick('Hello');
myLink.tick('Hello').tick('World').reverse();
```

random : 

```javascript
var myLink = linkjs({ 
  funcs : {
    // random don't use next
    tick : function(text) {
      console.log(text);
    }
  }
});

// Here your funcs will be call in random order 
myLink.tick('1').tick('2').tick('3').random();
```


## License

(The MIT License)

Copyright (c) 2011 Damien Fayol <dam.fayol@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.