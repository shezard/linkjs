## link

link is a simple tool to chain callback :

eg : 
  ```js
  var takeTime = function (text,cb) {
    console.log(text);
    if(cb) setTimeout(function(){cb()}, 1000);
  };
  ```
with link :
  ```js
  var myLink = link({ 
    funcs : {
      takeTime : function(text,next) {
        console.log(text);
        if(next) setTimeout(function(){next()}, 1000);
      }
    }
  });
  
  myLink.takeTime('Hello').takeTime('World').callback();
  ```
you can also pass some context around :
  ```js
  var myLink = link({ 
    context : {some:'context'},
    funcs : {
      takeTime : function(next) {
        console.log(this);
        if(next) setTimeout(function(){next()}, 1000);
      }
    }
  });
  ```
and use cb as an alias to callback : 
  ```js
  myLink.takeTime().takeTime().cb();
  ```
or pass the context inside your funcs :
  ```js
  var myLink = link({ 
    funcs : {
      takeTime : function(text,next) {
        console.log(this);
        if(next) setTimeout(function(){next({some:'con'+text})}, 1000);
      }
    }
  });
  
  myLink.takeTime('text1').takeTime('text2').cb();
  ```
you can also make multiple chain, each call to callback will launch the functions preceding it :
  ```js
  var myLink = link({ 
    funcs : {
      takeTime : function(text,next) {
        console.log(text);
        if(next) setTimeout(function(){next()}, 1000);
      }
    }
  });
  
  myLink.takeTime('Hello').takeTime('World').cb().takeTime('1').takeTime('2').cb();
  ```
## License

(The MIT License)

Copyright (c) 2011 Damien Fayol <dam.fayol@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.