
// ------------------------------------------
// store-params.js - v1.0.0
// Store URL Params
// Author: Łukasz Łabędzki
// Copyright (c) 2017 Livechat Software S.A.
// MIT license
//
// ------------------------------------------

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.StoreParams = factory();
  }
}(this, function () {
  var StoreParams = function(options){
    "use strict";

    var self = Object.create(StoreParams.prototype);

    // Default Settings
    self.options = {
      storage: 'cookies',
      cookieDuration: 14,
      cookieDomain: false,
      storeUTMs: true,
      storeReferrer: true,
      include: [],
      exclude: [],
      callback: function() {},
    };

    // User defined options (might have more in the future)
    if (options){
      Object.keys(options).forEach(function(key){
        self.options[key] = options[key];
      });
    }

    var referrer = document.referrer ? new URL(document.referrer) : null,
        location = new URL(document.location.href),
        searchParams = new URLSearchParams(location.search);

    if(!self.options.cookieDomain) {
      self.options.cookieDomain = '.' + location.hostname.replace(/^(www\.)/,'');
    }
  

    if(self.options.storeUTMs) {
      var utms = [
        {
          param: 'utm_medium'
        },
        {
          param: 'utm_campaign'
        },
        {
          param: 'utm_term'
        },
        {
          param: 'utm_content'
        }
      ];

      self.options.include = self.options.include.concat(utms)
    }

    switch (self.options.storage) {
        // Define create, read, earse functions for cookie
        case 'cookies':
          var store = function(name,value) {
            var days = self.options.cookieDuration

            if(value=='') {
              days = -1
            }

            var expires = "";
            if (self.options.cookieDuration) {
              var date = new Date();
              date.setTime(date.getTime() + (days*24*60*60*1000));
              expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + value + expires + ";domain=" + self.options.cookieDomain + "; path=/";
          }

          var read = function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
              var c = ca[i];
              while (c.charAt(0)==' ') c = c.substring(1,c.length);
              if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
          }

          var erase = function(name) {
            store(name,"");
          } 

          break;
        // Define create, read, earse functions for localStorage
        case 'localStorage':
          var localStorage = window.localStorage;

          var store = function(name, value) {
            localStorage.setItem(name, value)
          }

          var read = function(name) {
            return localStorage.getItem(name);
          }

          var erase = function(name) {
            localStorage.removeItem(name)
          }

          break;
        // Define create, read, earse functions for sessionStorage
        case 'sessionStorage':
         var sessionStorage = window.localStorage;

          var store = function(name, value) {
            sessionStorage.setItem(name, value)
          }

          var read = function(name) {
            return sessionStorage.getItem(name);
          }

          var erase = function(name) {
            sessionStorage.removeItem(name)
          }

          break;
        default: 
          break;
    }  

    var init = function() {
      // store UTMs
      if(self.options.storeUTMs) {
        // prevent utm params overlapping
        // when any utm is present, remove all
        var flush = utms.filter(function (u) {
          return searchParams.has(u.param);
        });

        if (flush.length || (referrer && referrer.hostname !== location.hostname)) {
          erase('utm_source');

          for (var i = 0; i < utms.length; i++) {
            erase(utms[i].param)
          }
        }

        // store utm_source, if no present - use referrer
        if(!self.options.exclude.includes('utm_source')) {
          var utm_source = null;

          if (searchParams.has('utm_source')) {
            utm_source = searchParams.get('utm_source');
          } else if (referrer && referrer.hostname !== location.hostname) {
            utm_source = referrer.hostname.replace(/^(www\.)/,'');
          }

          if (utm_source !== null) {
            store('utm_source', utm_source);
          }
        }
      }

      // store params
      for (var i = 0; i < self.options.include.length; i++) {
        if(searchParams.has(self.options.include[i].param) === true && !self.options.exclude.includes(self.options.include[i].param)) {
          if(self.options.include[i].storage) {
            store(self.options.include[i].storage, searchParams.get(self.options.include[i].param))
          } else {
            store(self.options.include[i].param, searchParams.get(self.options.include[i].param))
          }
        }
      }

      // store referrer (session, not rewritten)
      if (self.options.storeReferrer && referrer && referrer.hostname !== location.hostname) {
        store('referrer', referrer.href)
      }
    }

    self.read = function(storage) {
      return read(storage);
    }


    init();
    return self;
  };
  return StoreParams;
}));
