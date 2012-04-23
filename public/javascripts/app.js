(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "application": function(exports, require, module) {
    (function() {
  var Application, BrownbagApplication, BrownbagController, mediator, routes, support,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Application = require('chaplin/application');

  BrownbagController = require('controllers/brownbag_controller');

  routes = require('routes');

  support = require('chaplin/lib/support');

  module.exports = BrownbagApplication = (function(_super) {

    __extends(BrownbagApplication, _super);

    function BrownbagApplication() {
      BrownbagApplication.__super__.constructor.apply(this, arguments);
    }

    BrownbagApplication.prototype.title = 'Siberia Brownbag';

    BrownbagApplication.prototype.initialize = function() {
      BrownbagApplication.__super__.initialize.apply(this, arguments);
      new BrownbagController();
      this.initRouter(routes, {
        pushState: false
      });
      if (support.propertyDescriptors && Object.seal) Object.seal(mediator);
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return BrownbagApplication;

  })(Application);

}).call(this);

  }
}));
(this.require.define({
  "controllers/brownbag_controller": function(exports, require, module) {
    (function() {
  var BrownbagController, BrownbagView, Controller, mediator,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Controller = require('./controller');

  mediator = require('mediator');

  BrownbagView = require('views/brownbag_view');

  module.exports = BrownbagController = (function(_super) {

    __extends(BrownbagController, _super);

    function BrownbagController() {
      BrownbagController.__super__.constructor.apply(this, arguments);
    }

    BrownbagController.prototype.historyURL = 'brownbag';

    BrownbagController.prototype.initialize = function() {
      BrownbagController.__super__.initialize.apply(this, arguments);
      return this.view = new BrownbagView;
    };

    return BrownbagController;

  })(Controller);

}).call(this);

  }
}));
(this.require.define({
  "controllers/controller": function(exports, require, module) {
    (function() {
  var ChaplinController, Controller,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinController = require('chaplin/controllers/controller');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(ChaplinController);

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var Application;

  Application = require('./application');

  $(function() {
    var app;
    app = new Application();
    return app.initialize();
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/keymaster": function(exports, require, module) {
    //     keymaster.js
//     (c) 2011 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;(function(global){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      '⌥': 18, alt: 18, option: 18,
      '⌃': 17, ctrl: 17, control: 17,
      '⌘': 91, command: 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34,
      ',': 188, '.': 190, '/': 191,
      '`': 192, '-': 189, '=': 187,
      ';': 186, '\'': 222,
      '[': 219, ']': 221, '\\': 220
    };

  for(k=1;k<20;k++) _MODIFIERS['f'+k] = 111+k;

  // IE doesn't support Array#indexOf, so have a simple replacement
  function index(array, item){
    var i = array.length;
    while(i--) if(array[i]===item) return i;
    return -1;
  }

  // handle keydown event
  function dispatch(event){
    var key, handler, k, i, modifiersMatch;
    key = event.keyCode;

    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if(key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
      return;
    }

    // see if we need to ignore the keypress (ftiler() can can be overridden)
    // by default ignore key presses if a select, textarea, or input is focused
    if(!assignKey.filter.call(this, event)) return;

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers)) return;

    // for each potential shortcut
    for (i = 0; i < _handlers[key].length; i++) {
      handler = _handlers[key][i];

      // see if it's in the current scope
      if(handler.scope == _scope || handler.scope == 'all'){
        // check if modifiers match if any
        modifiersMatch = handler.mods.length > 0;
        for(k in _mods)
          if((!_mods[k] && index(handler.mods, +k) > -1) ||
            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
        // call the handler and stop the event if neccessary
        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
          if(handler.method(event, handler)===false){
            if(event.preventDefault) event.preventDefault();
              else event.returnValue = false;
            if(event.stopPropagation) event.stopPropagation();
            if(event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
	}
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k;
    if(key == 93 || key == 224) key = 91;
    if(key in _mods) {
      _mods[key] = false;
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
    }
  };

  function resetModifiers() {
    for(k in _mods) _mods[k] = false;
    for(k in _MODIFIERS) assignKey[k] = false;
  }

  // parse and assign shortcut
  function assignKey(key, scope, method){
    var keys, mods, i, mi;
    if (method === undefined) {
      method = scope;
      scope = 'all';
    }
    key = key.replace(/\s/g,'');
    keys = key.split(',');

    if((keys[keys.length-1])=='')
      keys[keys.length-2] += ',';
    // for each shortcut
    for (i = 0; i < keys.length; i++) {
      // set modifier keys if any
      mods = [];
      key = keys[i].split('+');
      if(key.length > 1){
        mods = key.slice(0,key.length-1);
        for (mi = 0; mi < mods.length; mi++)
          mods[mi] = _MODIFIERS[mods[mi]];
        key = [key[key.length-1]];
      }
      // convert to keycode and...
      key = key[0]
      key = _MAP[key] || key.toUpperCase().charCodeAt(0);
      // ...store handler
      if (!(key in _handlers)) _handlers[key] = [];
      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
    }
  };

  function filter(event){
    var tagName = (event.target || event.srcElement).tagName;
    // ignore keypressed in any elements that support keyboard data input
    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
  }

  // initialize key.<modifier> to false
  for(k in _MODIFIERS) assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){ _scope = scope || 'all' };
  function getScope(){ return _scope || 'all' };

  // delete all handlers for a given scope
  function deleteScope(scope){
    var key, handlers, i;

    for (key in _handlers) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length; ) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);
        else i++;
      }
    }
  };

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on'+event, function(){ method(window.event) });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', dispatch);
  addEvent(document, 'keyup', clearModifier);

  // reset modifiers to false whenever the window is (re)focused.
  addEvent(window, 'focus', resetModifiers);

  // set window.key and window.key.set/get/deleteScope, and the default filter
  global.key = assignKey;
  global.key.setScope = setScope;
  global.key.getScope = getScope;
  global.key.deleteScope = deleteScope;
  global.key.filter = filter;

  if(typeof module !== 'undefined') module.exports = key;

})(this);

  }
}));
(this.require.define({
  "lib/services/service_provider": function(exports, require, module) {
    (function() {
  var ServiceProvider, Subscriber, utils;

  utils = require('lib/utils');

  Subscriber = require('chaplin/lib/subscriber');

  module.exports = ServiceProvider = (function() {

    _(ServiceProvider.prototype).defaults(Subscriber);

    ServiceProvider.prototype.loading = false;

    function ServiceProvider() {
      _(this).extend($.Deferred());
      utils.deferMethods({
        deferred: this,
        methods: ['triggerLogin', 'getLoginStatus'],
        onDeferral: this.loadSDK
      });
    }

    ServiceProvider.prototype.disposed = false;

    ServiceProvider.prototype.dispose = function() {
      if (this.disposed) return;
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ServiceProvider;

  })();

  /*
  
    Standard methods and their signatures:
  
    loadSDK: ->
      # Load a script like this:
      utils.loadLib 'http://example.org/foo.js', @sdkLoadHandler, @reject
  
    sdkLoadHandler: =>
      # Init the SDK, then resolve
      someSDK.init(foo: 'bar')
      @resolve()
  
    isLoaded: ->
      # Return a Boolean
      Boolean window.someSDK and someSDK.login
  
    # Trigger login popup
    triggerLogin: (loginContext) ->
      callback = _(@loginHandler).bind(this, @loginHandler)
      someSDK.login callback
  
    # Callback for the login popup
    loginHandler: (loginContext, response) =>
  
      if response
        # Publish successful login
        mediator.publish 'loginSuccessful',
          provider: this, loginContext: loginContext
  
        # Publish the session
        mediator.publish 'serviceProviderSession',
          provider: this
          userId: response.userId
          accessToken: response.accessToken
          # etc.
  
      else
        mediator.publish 'loginFail', provider: this, loginContext: loginContext
  
    getLoginStatus: (callback = @loginStatusHandler, force = false) ->
      someSDK.getLoginStatus callback, force
  
    loginStatusHandler: (response) =>
      return unless response
      mediator.publish 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.
  */

}).call(this);

  }
}));
(this.require.define({
  "lib/services/twitter": function(exports, require, module) {
    (function() {
  var ServiceProvider, Twitter, mediator, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  ServiceProvider = require('lib/services/service_provider');

  module.exports = Twitter = (function(_super) {
    var consumerKey;

    __extends(Twitter, _super);

    consumerKey = 'w0uohox9lTgpKETJmscYIQ';

    Twitter.prototype.name = 'twitter';

    function Twitter() {
      this.loginStatusHandler = __bind(this.loginStatusHandler, this);
      this.loginHandler = __bind(this.loginHandler, this);
      this.sdkLoadHandler = __bind(this.sdkLoadHandler, this);      Twitter.__super__.constructor.apply(this, arguments);
      this.subscribeEvent('!logout', this.logout);
    }

    Twitter.prototype.loadSDK = function() {
      if (this.state() === 'resolved' || this.loading) return;
      this.loading = true;
      return utils.loadLib("http://platform.twitter.com/anywhere.js?id=" + consumerKey + "&v=1", this.sdkLoadHandler, this.reject);
    };

    Twitter.prototype.sdkLoadHandler = function() {
      var _this = this;
      this.loading = false;
      return twttr.anywhere(function(T) {
        mediator.publish('sdkLoaded');
        _this.T = T;
        return _this.resolve();
      });
    };

    Twitter.prototype.isLoaded = function() {
      return Boolean(window.twttr);
    };

    Twitter.prototype.publish = function(event, callback) {
      return this.T.trigger(event, callback);
    };

    Twitter.prototype.subscribe = function(event, callback) {
      return this.T.bind(event, callback);
    };

    Twitter.prototype.unsubscribe = function(event) {
      return this.T.unbind(event);
    };

    Twitter.prototype.triggerLogin = function(loginContext) {
      var callback;
      callback = _(this.loginHandler).bind(this, loginContext);
      this.T.signIn();
      this.subscribe('authComplete', function(event, currentUser, accessToken) {
        return callback({
          currentUser: currentUser,
          accessToken: accessToken
        });
      });
      return this.subscribe('signOut', function() {
        console.log('SIGNOUT EVENT');
        return callback();
      });
    };

    Twitter.prototype.publishSession = function(response) {
      var user;
      user = response.currentUser;
      mediator.publish('serviceProviderSession', {
        provider: this,
        userId: user.id,
        accessToken: response.accessToken || twttr.anywhere.token
      });
      return mediator.publish('userData', user.attributes);
    };

    Twitter.prototype.loginHandler = function(loginContext, response) {
      console.debug('Twitter#loginHandler', loginContext, response);
      if (response) {
        mediator.publish('loginSuccessful', {
          provider: this,
          loginContext: loginContext
        });
        return this.publishSession(response);
      } else {
        return mediator.publish('loginFail', {
          provider: this,
          loginContext: loginContext
        });
      }
    };

    Twitter.prototype.getLoginStatus = function(callback, force) {
      if (callback == null) callback = this.loginStatusHandler;
      if (force == null) force = false;
      console.debug('Twitter#getLoginStatus');
      return callback(this.T);
    };

    Twitter.prototype.loginStatusHandler = function(response) {
      console.debug('Twitter#loginStatusHandler', response);
      if (response.currentUser) {
        return this.publishSession(response);
      } else {
        return mediator.publish('logout');
      }
    };

    Twitter.prototype.logout = function() {
      var _ref;
      console.log('Twitter#logout');
      return typeof twttr !== "undefined" && twttr !== null ? (_ref = twttr.anywhere) != null ? typeof _ref.signOut === "function" ? _ref.signOut() : void 0 : void 0 : void 0;
    };

    return Twitter;

  })(ServiceProvider);

}).call(this);

  }
}));
(this.require.define({
  "lib/shortcut": function(exports, require, module) {
    (function() {
  var KeyMaster, Shortcuts;

  KeyMaster = require('lib/keymaster');

  module.exports = Shortcuts = {
    mapShortcuts: function(keyMap) {
      var shortcut, _i, _len, _ref, _results;
      _ref = this.parseShortcutMap(keyMap);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        shortcut = _ref[_i];
        _results.push(KeyMaster(shortcut.key, shortcut.scope, shortcut.method));
      }
      return _results;
    },
    parseShortcutMap: function(keyMap) {
      var key, vWrap, value, _results;
      _results = [];
      for (key in keyMap) {
        value = keyMap[key];
        vWrap = _(value);
        if (vWrap.isString()) {
          _results.push({
            "key": key,
            "scope": "all",
            "method": this[value]
          });
        } else if (vWrap.isFunction()) {
          _results.push({
            "key": key,
            "scope": "all",
            "method": value
          });
        } else if (vWrap.isObject()) {
          value["key"] = key;
          if (_(value.method).isString()) value.method = this[value.method];
          _results.push(value);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    getShortcutScope: function() {
      return KeyMaster.getScope();
    },
    setShortcutScope: function(scope) {
      return KeyMaster.setScope(scope);
    },
    setShortcutFilter: function(filterFunction) {
      return KeyMaster.filter = filterFunction;
    },
    deleteShortcutScope: function(scope) {
      return KeyMaster.deleteScope(scope);
    }
  };

  if (typeof Object.freeze === "function") Object.freeze(Shortcuts);

  Shortcuts;

}).call(this);

  }
}));
(this.require.define({
  "lib/support": function(exports, require, module) {
    (function() {
  var chaplinSupport, support, utils;

  utils = require('lib/utils');

  chaplinSupport = require('chaplin/lib/support');

  module.exports = support = utils.beget(chaplinSupport);

}).call(this);

  }
}));
(this.require.define({
  "lib/utils": function(exports, require, module) {
    (function() {
  var chaplinUtils, mediator, utils;

  mediator = require('mediator');

  chaplinUtils = require('chaplin/lib/utils');

  module.exports = utils = chaplinUtils.beget(chaplinUtils);

  _(utils).extend({
    facebookImageURL: function(fbId, type) {
      var accessToken, params;
      if (type == null) type = 'square';
      params = {
        type: type
      };
      if (mediator.user) {
        accessToken = mediator.user.get('accessToken');
        if (accessToken) params.access_token = accessToken;
      }
      return "https://graph.facebook.com/" + fbId + "/picture?" + ($.param(params));
    }
  });

}).call(this);

  }
}));
(this.require.define({
  "lib/view_helper": function(exports, require, module) {
    (function() {

  Handlebars.registerHelper('transform_if_retweeted', function(options) {
    var data;
    if (this.retweeted_status) {
      data = _.clone(this.retweeted_status);
      data.retweeter = this.user;
      return options.fn(data);
    } else {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper('auto_link', function(options) {
    return new Handlebars.SafeString(twttr.txt.autoLink(options.fn(this)));
  });

  Handlebars.registerHelper('format_date', function(options) {
    var date;
    date = new Date(options.fn(this));
    return new Handlebars.SafeString(moment(date).fromNow());
  });

  Handlebars.registerHelper('unless_is_web', function(source, options) {
    var string;
    string = source === 'web' ? '' : options.fn(this);
    return new Handlebars.SafeString(string);
  });

}).call(this);

  }
}));
(this.require.define({
  "mediator": function(exports, require, module) {
    (function() {
  var createMediator, mediator;

  createMediator = require('chaplin/lib/create_mediator');

  module.exports = mediator = createMediator({
    createRouterProperty: true,
    createUserProperty: true
  });

}).call(this);

  }
}));
(this.require.define({
  "models/collection": function(exports, require, module) {
    (function() {
  var ChaplinCollection, Collection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinCollection = require('chaplin/models/collection');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(ChaplinCollection);

}).call(this);

  }
}));
(this.require.define({
  "models/model": function(exports, require, module) {
    (function() {
  var ChaplinModel, Model,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinModel = require('chaplin/models/model');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(ChaplinModel);

}).call(this);

  }
}));
(this.require.define({
  "routes": function(exports, require, module) {
    (function() {

  module.exports = function(match) {};

}).call(this);

  }
}));
(this.require.define({
  "views/brownbag_view": function(exports, require, module) {
    (function() {
  var BrownbagView, View, mediator, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('./view');

  template = require('./templates/brownbag');

  module.exports = BrownbagView = (function(_super) {

    __extends(BrownbagView, _super);

    function BrownbagView() {
      BrownbagView.__super__.constructor.apply(this, arguments);
    }

    BrownbagView.prototype.template = template;

    BrownbagView.prototype.id = 'brownbag';

    BrownbagView.prototype.containerSelector = '#content';

    BrownbagView.prototype.autoRender = true;

    BrownbagView.prototype.shortcutScope = "j";

    BrownbagView.prototype.shortcuts = {
      "⌘ + f": "onCommandF",
      "⌘ + j": {
        scope: "u",
        method: "onCommandJ"
      },
      "⌘ + u": {
        scope: "j",
        method: function(event, handler) {
          alert(handler.key);
          return false;
        }
      }
    };

    BrownbagView.prototype.onCommandF = function(event, handler) {
      console.debug(handler.shortcut, handler.scope);
      return alert("f");
    };

    BrownbagView.prototype.onCommandJ = function(event, handler) {
      console.debug(handler.shortcut, handler.scope);
      return alert("j");
    };

    return BrownbagView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/composite_view": function(exports, require, module) {
    (function() {
  var CompositeView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  View = require('views/view');

  module.exports = CompositeView = (function(_super) {

    __extends(CompositeView, _super);

    function CompositeView() {
      this.dispose = __bind(this.dispose, this);
      this.render = __bind(this.render, this);
      CompositeView.__super__.constructor.apply(this, arguments);
    }

    CompositeView.prototype.initialize = function() {
      CompositeView.__super__.initialize.apply(this, arguments);
      return this.subViews = [];
    };

    CompositeView.prototype.attachView = function(view) {
      return this.subViews.push(view);
    };

    CompositeView.prototype.renderSubViews = function() {
      var _this = this;
      return _(this.subViews).forEach(function(view) {
        return _this.$(view.containerSelector).append(view.render().el);
      });
    };

    CompositeView.prototype.render = function() {
      CompositeView.__super__.render.apply(this, arguments);
      return this.renderSubViews();
    };

    CompositeView.prototype.dispose = function() {
      var _this = this;
      CompositeView.__super__.dispose.apply(this, arguments);
      return _(this.subViews).forEach(function(view) {
        return view.dispose();
      });
    };

    return CompositeView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/slice": function(exports, require, module) {
    (function() {
  var SliceView, View, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('./view');

  module.exports = SliceView = (function(_super) {

    __extends(SliceView, _super);

    function SliceView() {
      this.loginStatusHandler = __bind(this.loginStatusHandler, this);
      SliceView.__super__.constructor.apply(this, arguments);
    }

    SliceView.prototype.className = 'step';

    SliceView.prototype.containerSelector = '#impress';

    SliceView.prototype.initialize = function() {
      SliceView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.loginStatusHandler);
      return this.subscribeEvent('userData', this.render);
    };

    SliceView.prototype.loginStatusHandler = function(loggedIn) {
      if (loggedIn) {
        this.model = mediator.user;
      } else {
        this.model = null;
      }
      return this.render();
    };

    return SliceView;

  })(View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/brownbag": function(exports, require, module) {
    module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<h3 tabindex=\"-1\">brownbag</h3>";});
  }
}));
(this.require.define({
  "views/view": function(exports, require, module) {
    (function() {
  var ChaplinView, Shortcut, View,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ChaplinView = require('chaplin/views/view');

  Shortcut = require('lib/shortcut');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      View.__super__.constructor.apply(this, arguments);
    }

    _(View.prototype).extend(Shortcut);

    View.prototype.shortcutScope = "all";

    View.prototype.$lastShortcutScope = "all";

    View.prototype.shortcuts = null;

    View.prototype.initialize = function(options) {
      this.shortcutScope || (this.shortcutScope = options != null ? options.shortcutScope : void 0);
      this.shortcuts || (this.shortcuts = options != null ? options.shortcuts : void 0);
      this.initShortcuts();
      return View.__super__.initialize.apply(this, arguments);
    };

    View.prototype.initShortcuts = function() {
      this.mapShortcuts(this.shortcuts);
      console.debug(this.delegate("focusin", this.onFocusIn));
      console.debug(this.delegate("focusout", this.onFocusOut));
      return this;
    };

    View.prototype.onFocusIn = function(event) {
      console.debug("focusin: set shortcut scope to: ", this.shortcutScope);
      this.$lastShortcutScope = this.getShortcutScope();
      return this.setShortcutScope(this.shortcutScope);
    };

    View.prototype.onFocusOut = function(event) {
      console.debug("focusin: set shortcut scope to: ", this.$lastShortcutScope);
      return this.setShortcutScope(this.$lastShortcutScope);
    };

    return View;

  })(ChaplinView);

}).call(this);

  }
}));
