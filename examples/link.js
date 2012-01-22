  // Encapsulation based on underscore.js
  (function() {
  
    root = this;
    
    root.linkjs = function(opts) {
      
      // We save opts and set _opts.context to something
      var _opts = opts;
      // _opts.context is the global context
      _opts.context = _opts.context || this;
      
      // Throw Error if no opts.funcs
      if(!opts || typeof _opts.funcs !== 'object' || _empty(opts.funcs)) throw Error('you should specified funcs to work with');
      
      // Throw Error if opts.funcs[stuff] is not a function, or is 'reserved' keyword
      for(var prop in opts.funcs) {
        if(typeof opts.funcs[prop] !== 'function') throw Error('Your function for "'+prop+'" is not really a function');
        if(prop === 'callback') throw Error('You are going to overide "callback", please use cb to start chaining');
        if(prop === 'cb') throw Error('You are going to overide "cb", please use callback to start chaining');
        if(prop === 'loop') throw Error('You are going to overide "loop", it won\'t be accessible anymore');
        if(prop === 'chain') throw Error('You are going to overide "chain", it won\'t be accessible anymore');
        if(prop === 'reverse') throw Error('You are going to overide "reverse", it won\'t be accessible anymore');
        if(prop === 'random') throw Error('You are going to overide "random", it won\'t be accessible anymore');
      }
      
      // The inner chain of functions to be called 
      var _chain = [];
      
      // Call each function in chain from first to last binding context each time
      var _order = function(context) {
        // We just call each function in order
        var i=-1;l = _chain.length;
        if(!l) return;
        for(;++i<l;){
          var chain = _chain[i];
          // For each function we rebind the context & add call with the recorded args
          chain.func.apply(_opts.context || context,chain.args);
        }
      };
      
      // Call each function in chain from last to first binding context each time
      var _reverse = function(context) {
        // We just call each function in reverse order
        var l = _chain.length;
        if(!l) return;
        for(;l--;){
          var chain = _chain[l];
          // For each function we rebind the context & add call with the recorded args
          chain.func.apply(_opts.context || context,chain.args);
        }
      };
      
      // Call each function in chain in random order binding context each time
      var _random = function(context) {
        var l = _chain.length + 1;
        if(!l) return;
        for(;l-- > 1;) {
          var r = Math.floor(Math.random()*l)
          var chain = _chain.splice(r,1);
          chain[0].func.apply(_opts.context || context,chain[0].args);
        }
      };
      
      // Modify each item in _chain to hold the callback as the arg
      var _callback = function(context,loop) {
        var i=-1, l=_chain.length, next;
        if(!l) return;
        for(;++i< l;) {
          // We set next to the next chain item if any
          if(next = _chain[i+1]) {
            // We create a closure as the last args of this item of the chain
            _chain[i].args[_chain[i].args.length] = (function() {
              // We keep next accessible
              var _next = next;
              // We keep the global context accessible
              var _context = _opts.context;
              return function() {
                // Here We merge the arguments received by this function, if any and _next.args
                var i = -1, l = _next.args.length;
                for(;++i<l;) {
                  arguments[arguments.length] = _next.args[i];
                  arguments.length++;
                }
                // We apply the global context (_opts.context) or this as the context
                _next.func.apply((_context || context), arguments);
              };
            })();
            // We increment the length of the arguments
            _chain[i].args.length++;
          // If we are called via .loop()
          } else if(loop) {
            // The last item will be first 
            next = _chain[0];
            _chain[i].args[_chain[i].args.length] = (function() {
              var _next = next;
              var _context = _opts.context;
              return function() {
                var i = -1, l = _next.args.length;
                for(;++i<l;) {
                  arguments[arguments.length] = _next.args[i];
                  arguments.length++;
                }
                _next.func.apply((_context || context), _next.args);
              };
            })();
            _chain[i].args.length++;
          }
        }
        // We call the first func as usual binding either _opts.context or context
        _chain[0].func.apply((_opts.context || context), _chain[0].args);
      };
      
      // Common implementation for callback and cb to keep things DRY
      initCallback = function(context,obj) {
        _callback(obj);
        // We clean the chain, to enable mutiple chains to be called
        _chain = [];
        // If a context was specified we overide the global context for the future chain to be called
        _opts.context = context || _opts.context;
        // We return this to enable chaining
        return obj;
      };
      
      // Tell you if an object is empty, using auto-hoisting here
      function _empty (obj) {
        for (var key in obj) if (obj.hasOwnProperty(key)) return false;
        return true;
      };
      
      // We prepare _link, which will be returned by the function    
      var _link = function(){};
      // We set the prototype chain
      _link.prototype = {
        // Callback is the function which start the chain
        callback : function(context) {
          return initCallback(context,this);
        },
        // Alias to callback
        cb : function(context) {
          return initCallback(context,this);
        },
        // Loop CallBack
        loop : function(context) {
          _callback(this,true);
          // We clean the chain, to enable mutiple chains to be called
          _chain = [];
          // If a context was specified we overide the global context for the future chain to be called
          _opts.context = context || _opts.context;
          // We return this to enable chaining
          return this;
        },
        // Call each item in order (no cb involved)
        chain : function() {
          _order(this);
          //We clean the chain, to enable multiple chains to be called
          _chain = [];
          // We return this to enable chaining
          return this;
        },
        // Call each item in reverse order (no cb involved)
        reverse : function() {
          _reverse(this);
          //We clean the chain, to enable multiple chains to be called
          _chain = [];
          // We return this to enable chaining
          return this;
        },
        // Call each item in random order (no cb involved)
        random : function() {
          _random(this);
          //We clean the chain, to enable multiple chains to be called
          _chain = [];
          // We return this to enable chaining
          return this;
        }
      };
      
      // We feed _link with the functions given inside _opts.func
      for (var prop in _opts.funcs) {
        // We set a closure
        _link.prototype[prop] = (function() {
          // To save the current state of prop
          var _prop = prop;
          // The closure return this function, with the correct _prop
          return function() {
            // The actual content of the prop() function, a simple push of function & args into _chain
            _chain.push({func:_opts.funcs[_prop],args:arguments});
            // We return this to enable chaining
            return this;
          }
        })();
      };
      // We return an access to the _link object
      return new _link;
    };
    // the root is returned 
    return root;
    // We call the outer closure with this so either global(in node) or window(in browser) is accesible
  }).call(this);