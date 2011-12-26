window.linkjs = function(opts){
    
  // We save opts and set _opts.context to something
  var _opts = opts;
  // _opts.context is the global context
  _opts.context = _opts.context || this;
  
  // throw Error if no opts.funcs
  if(!opts || _(opts.funcs).isEmpty()) throw new Error('you should specified funcs to work with');
  
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
  
  var _callback = function(context) {
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
          console.log(_opts);
          var _context = _opts.context;
          return function(localContext){
            // We apply the global context (_opts.context) or this as the context
            _next.func.apply((localContext || _context || context), _next.args);
          };
        })();
        _chain[i].args.length++;
      }
    }
    // We call the first func as usual binding either _opts.context or context
    _chain[0].func.apply((_opts.context || context), _chain[0].args);
  };
  
  // We prepare _link, which will be returned by the function    
  var _link = {
    // Callback is the function which start the chain
    callback : function() {
      _callback(this);
      // We clean the chain, to enable mutiple chains to be called
      _chain = [];
      // We return this to enable chaining
      return this;
    },
    // Alias to callback
    cb : function() {
      _callback(this);
      // We clean the chain, to enable mutiple chains to be called
      _chain = [];
      // We return this to enable chaining
      return this;
    },
    reverse : function() {
      _reverse(this);
      //We clean the chain, to enable multiple chains to be called
      _chain = [];
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

window.onload = function() {  
  linkjs({ 
    context : _,
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
};