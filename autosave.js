(function() {
  var $, Meta;

  $ = jQuery;

  $(document).ready(function() {
    Meta.parseHTML();
    return AutoSave.enable(document.body);
  });

  Meta = (function() {

    function Meta() {}

    Meta.parseHTML = function() {
      return $("meta").each(function() {
        return Meta[this.name] = this.content;
      });
    };

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
      this.generateHashKey();
      this.restore();
      this.setupBindings();
    }

    AutoSave.prototype.setupBindings = function() {
      var ev, form, _i, _len, _ref;
      var _this = this;
      _ref = ["paste", "change", "keyup"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ev = _ref[_i];
        $(this.input).bind(ev, function() {
          return _this.save();
        });
      }
      form = $(this.input).closest("form");
      form.find("input:submit").click(function() {
        return _this.clear();
      });
      return form.find("[data-behavior~=clear]").click(function() {
        return _this.clear();
      });
    };

    AutoSave.prototype.generateHashKey = function() {
      return this.storageKey = "autosave:" + [Meta.current_user, this.input.name, $(this.input).closest("form").attr("action"), escape(window.location.pathname)].join(";;");
    };

    AutoSave.prototype.save = function() {
      return DS.setItem(this.storageKey, this.input.value);
    };

    AutoSave.prototype.clear = function() {
      return DS.removeItem(this.storageKey);
    };

    AutoSave.prototype.restore = function() {
      if (!this.input.value) {
        return this.input.value = DS.getItem(this.storageKey) || "";
      }
    };

    return AutoSave;

  })();

}).call(this);
