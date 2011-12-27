window.linkjs = function(opts){
    
  // We save opts and set _opts.context to something
  var _opts = opts;
  // _opts.context is the global context
  _opts.context = _opts.context || this;
  
  // throw Error if no opts.funcs
  if(!opts || typeof _opts.funcs !== 'object' || _empty(opts.funcs)) throw new Error('you should specified funcs to work with');
  
  // throw Error if opts.funcs[stuff] is not a function
  for(var prop in opts.funcs) {
    if(typeof opts.funcs[prop] !== 'function') throw new Error('Your function for '+prop+' is not really a function');
  }
  
  // the inner chain of functions to be called 
  var _chain = [];
  
  // call each function in chain from last to first binding context each time
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
  
  var _callback = function(context,loop) {
    var i=-1, l=_chain.length, next;
    if(!l) return;
    for(;++i< l;) {
      // We set next to the next chain item if any
      if(next = _chain[i+1]) {
        // We create a closure as the last args of this item of the chain
        _chain[i].args[_chain[i].args.length] = (function(){
          // We keep next accessible
          var _next = next;
          // We keep the global context accessible
          var _context = _opts.context;
          return function(localContext) {
            // We apply the global context (_opts.context) or this as the context
            _next.func.apply((localContext || _context || context), _next.args);
          };
        })();
        // We increment the length of the arguments
        _chain[i].args.length++;
      // If we are called via .loop()
      } else if(loop) {
        // The last item will be first 
        next = _chain[0];
        _chain[i].args[_chain[i].args.length] = (function(){
          var _next = next;
          var _context = _opts.context;
          return function(localContext) {
            _next.func.apply((localContext || _context || context), _next.args);
          };
        })();
        _chain[i].args.length++;
      }
    }
    // We call the first func as usual binding either _opts.context or context
    _chain[0].func.apply((_opts.context || context), _chain[0].args);
  };
  
  // Tell you if an object is empty
  function _empty (obj) {
   for (var key in obj) if (obj.hasOwnProperty(key)) return false;
    return true;
  }
  
  // We prepare _link, which will be returned by the function    
  var _link = {
    // Callback is the function which start the chain
    callback : function(context) {
      _callback(this);
      // We clean the chain, to enable mutiple chains to be called
      _chain = [];
      // If a context was specified we overide the global context for the future chain to be called
      _opts.context = context || _opts.context;
      // We return this to enable chaining
      return this;
    },
    // Alias to callback
    cb : function(context) {
      _callback(this);
      // We clean the chain, to enable mutiple chains to be called
      _chain = [];
      // If a context was specified we overide the global context for the future chain to be called
      _opts.context = context || _opts.context;
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
    // Loop CallBack
    loop : function(context) {
      _callback(this,true);
      // We clean the chain, to enable mutiple chains to be called
      _chain = [];
      // If a context was specified we overide the global context for the future chain to be called
      _opts.context = context || _opts.context;
      // We return this to enable chaining
      return this;
    }
  };
  
  // We feed _link with the functions given inside _opts.func
  for (var prop in _opts.funcs) {
    // We set a closure
    _link[prop] = (function() {
      // To save the current state of prop
      var _prop = prop;
      // The closure return this function, with the correct _prop
      return function() {
        _chain.push({func:_opts.funcs[_prop],args:arguments});
        // We return this to enable chaining
        return this;
      }
    })();
  };
  return _link;
};