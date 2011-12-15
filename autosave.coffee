# because $ is prototype in most of my apps, but I love jQuery now - this
# lets me use $ inside the Coffee wrapper without even thinking about Prototype
$ = jQuery

# enable any autosave fields on the entire page after it's loaded
$(document).ready ->
  AutoSave.enable document.body

# quick class to define globals we'll use later to generate unique
# hash keys to store the autosave values
class Meta
  @current_user = $("meta[name=current_user]").attr "content"

# The @ makes sure this class is global and escapes the CoffeeScript wrapper
class @AutoSave
  # allow another storage engine to be dropped in quickly
  DS = window.localStorage
  
  # given a root object will make sure any descendants with autosave
  # properties and autosave enabled... you would want to use this after
  # adding content to a page with AJAX such as:
  @enable: (root) ->
    if DS and not navigator.userAgent.match "MSIE [78]"
      $(root).find("[data-behavior~=autosave]").each ->
        new AutoSave(this)
      
  constructor: (@input) ->
    @storageKey = @generateHashKey()    
    @restore()    
    @setupBindings()
    
  setupBindings: ->
    # detect changes
    for ev of ["paste", "change", "keyup"]
      $(@input).bind ev, => @save()
    # clear on submit or if a clear behavior item is clicked
    form = $(@input).closest "form"
    form.find("input:submit").click => @clear()
    form.find("[data-behavior~=clear]").click => @clear()
  
  # generate a unique key for every input field you wish autosave to work 
  # with - you should make sure this is unique so that you don't have the
  # wrong autosave data popping up randomly on other pages of your app
  generateHashKey: -> 
    "autosave:" + [
      Meta.current_user,
      @input.name,
      $(@input).parents("form")[0].action,
      escape(window.location.pathname)].join(";;")
  
  save: ->
    DS.setItem @storageKey, @input.value
    
  clear: ->
    DS.removeItem @storageKey
    
  restore: ->
    unless @input.value
      if (old = DS.getItem @storageKey)
        @input.value = old