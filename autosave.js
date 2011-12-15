(function() {
  var $, Meta;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = jQuery;
  $(document).ready(function() {
    return AutoSave.enable(document.body);
  });
  Meta = (function() {
    function Meta() {}
    Meta.current_user = $("meta[name=current_user]").attr("content");
    return Meta;
  })();
  this.AutoSave = (function() {
    var DS;
    DS = window.localStorage;
    AutoSave.enable = function(root) {
      if (DS && !navigator.userAgent.match("MSIE [78]")) {
        return $(root).find("[data-behavior~=autosave]").each(function() {
          return new AutoSave(this);
        });
      }
    };
    function AutoSave(input) {
      this.input = input;
      this.storageKey = this.generateHashKey();
      this.restore();
      this.setupBindings();
    }
    AutoSave.prototype.setupBindings = function() {
      $(this.input).change(__bind(function() {
        return this.save();
      }, this));
      $(this.input).bind("paste", __bind(function() {
        return this.save();
      }, this));
      $(this.input).bind("keyup", __bind(function() {
        return this.save();
      }, this));
      $(this.input).parents("form").find("input:submit").click(__bind(function() {
        return this.clear();
      }, this));
      return $(this.input).parents("form").find("[data-behavior~=clear]").click(__bind(function() {
        return this.clear();
      }, this));
    };
    AutoSave.prototype.generateHashKey = function() {
      return "autosave:" + [Meta.current_user, this.input.name, $(this.input).parents("form")[0].action, escape(window.location.pathname)].join(";;");
    };
    AutoSave.prototype.save = function() {
      return DS.setItem(this.storageKey, this.input.value);
    };
    AutoSave.prototype.clear = function() {
      return DS.removeItem(this.storageKey);
    };
    AutoSave.prototype.restore = function() {
      var old;
      if (!this.input.value) {
        if ((old = DS.getItem(this.storageKey))) {
          return this.input.value = old;
        }
      }
    };
    return AutoSave;
  })();
}).call(this);
