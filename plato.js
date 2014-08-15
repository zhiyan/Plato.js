/*!
 * Plato.js - templates engine with JavaScript
 * http://github.com/zhiyan/plato.js
 *
 * Date: 2014-04-16
 */

(function(root){
  "use strict";

  var P = function(str, data, configuration) {
    var settings = extend(config, configuration || null),
        dp = settings.tags,
        fn;

    fn = Logos( str, settings);

    return data ? fn(data) : fn;
  };

  var core_name = "plato",
      version = "0.0.1";

  var config = {
      "tags" : [ "{{", "}}" ],
      "unescape" : false
  };

  var cache = {};

  /**
   * Republic module
   * a plugin system
   */
   var Republic = {
      "type" : ["each","if","with"]
   };
   extend( Republic, {
      "each" : function( scope, obj ){
        var res='';
        for(var i=0;i<obj.length;i++){
          res += scope;
        };
        return res;
      },
      "if" : function( scope, obj ){
          return !!obj ? scope : "";
      },
      "with" : function( scope, obj ){
        return scope;
      }
   })

  /**
   * Logos module
   * a parser system
   */
  var Logos = function( str, settings) {
    var dp = settings.tags,
        tag = Republic.type.join("|"),
        handle,
        hole,
        tryWrap,
        parse,
        unescape;

    // regex
    var dpl = dp[0],
        dpr = dp[1],
        rnochar = /\W/,
        rspace = /[\r\t\n]/g,
        reach = /^\s*?each/g,
        rwith = /^\s*?with/g,
        rtag = new RegExp( "^"+dpl+"#("+tag+")\\s+([^"+dpr+"]+)" ),
        rvar = new RegExp( dpl+"\\s*?(.*?)\\s*?"+dpr, "g"),
        rend = new RegExp( "\t(.*?)" + dpr, "g" ),
        rscope = new RegExp( dpl+"#(?:"+tag+")\\s+[^"+dpr+"]+"+dpr+"(.*?)"+dpl+"/(?:"+tag+")\\s*"+dpr,"g" );

    // unescape
    unescape = function( str ){
      var tag = {
        '&amp;' : '&',
        '&lt;' : '<',
        '&gt;' : '>',
        '&quot;' : '"',
        '&#x27;' : "'"
      }
      for(var i in tag){
        str = str.replace(new RegExp(i,"ig"),tag[i])
      }
      return str;
    }
    escape = function( str){
      var tag = {
        '"' : '&quot;',
        "'" : '&#x27;'
      }
      for(var i in tag){
        str = str.replace(new RegExp(i,"ig"),tag[i])
      }
      return str;
    }

    // handle
    handle = function( type, key, scope ){
      return "',(function(obj){" + hole(type,scope,key) + "})(typeof "+key+" !== 'undefined' ? "+key+" : {}),'";
    }

    // try wrap
    tryWrap = function( str ){
      return "\"+(function(){try{return "+str+" || '';}catch(e){return ''}}())+\"";
    }

    // hole
    hole = function( type, scope, context ){
      var res;
      scope = escape(scope);
      if( reach.test(type) ){
        scope = scope.replace(rvar,function(all,key){
          return tryWrap("obj[i]."+key);
        });
      }else if( rwith.test(type) ){
        scope = scope.replace(rvar,function(all,key){
          return tryWrap(context+"."+key);
        });
      }else{
         scope = scope.replace(rvar,function(all,key){
           return tryWrap(key);
        });
      }
      res = Republic[type].toString().replace(rspace," ");
      res = res.substring( res.indexOf("{")+1,res.lastIndexOf("}") );
      res = res.replace(/scope/g, '"'+scope+'"');
      return res;
    }

    // parse
    parse = function( str ){
      
      str = str.replace(rspace, " ");

      str = str.replace( rscope, function(scope){
        var type = scope.match(rtag)[1] || "",
            key = scope.match(rtag)[2] || "";

        if(type && inArray( Republic.type, type ) >= 0 ){
          rscope.lastIndex = 0;
          rscope.index = 0;
          return handle( type, key, ( rscope.exec(scope) || ["",""] )[1]  );
        }
        return scope;
      });

      str = str.split(dpl).join("\t").replace(rend, "',$1,'");
      return str;
    }

    str = settings.unescape ? unescape(str) : str;

    return !rnochar.test(str) ?
      cache[str] = cache[str] ||
      P(document.getElementById(str).innerHTML) :

      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        "with(obj||{}){p.push('" + parse( str ) + "');}return p.join('');");
  }

   /**
   * prototype
   * utility functions & variable
   */
  extend( P, {
    module : core_name,
    version : version,
    config : function( param ){
      extend( config, param );
    }
  })

  function isObj( obj ){
    return obj === Object( obj );
  }

  function extend( target, obj ){
    if( !isObj(obj) ) return target;
    for( var i in obj ){
      target[i] = obj[i];
    }
    return target;
  }

  function inArray( array, item, from ){
    if (array == null) return -1;
    var i = from == null ? array.length : from;
    while (i--) if (array[i] === item) return i;
    return -1;
  }

   /**
   * export
   * nodeJs module & AMD & script
   */
  if (typeof exports !== 'undefined') {
    // node
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = P;
    }
    exports.P = P;
  }else if(typeof define === "function" && define.amd) {
    define(P); // AMD
  } else {
    root.P = root.plato = P; // <script>
  }

})(this);
