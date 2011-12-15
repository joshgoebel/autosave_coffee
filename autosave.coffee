# because $ is prototype in most of my apps, but I love jQuery now - this
# lets me use $ inside the Coffee wrapper without even thinking about Prototype
$=jQuery

# enable any autosave fields on the entire page after it's loaded
$(document).ready ->
  AutoSave.enable(document.body)

# quick class to define globals we'll use later to generate unique
# hash keys to store the autosave values
class Meta
  cu = $("meta[name=current_user]")[0]
  @current_user = if cu then cu.content else null

# The @ makes sure this class is global and escapes the CoffeeScript wrapper
class @AutoSave
  # allow another storage engine to be dropped in quickly
  DS = window.localStorage
  
  # given a root object will make sure any descendants with autosave
  # properties and autosave enabled... you would want to use this after
  # adding content to a page with AJAX such as:
  @enable: (root) ->
    if DS and not navigator.userAgent.match("MSIE [78]")
      $(root).find("[data-behavior~=autosave]").each ->
        new AutoSave(this)
      
  constructor: (@input) ->
    @setup()
    @restore()    
    
  setup: ->
    @storageKey = @generateHashKey()    
    # detect changes
    $(@input).change => @save()
    $(@input).bind "paste", => @save()
    $(@input).bind "keyup", => @save()
    # clear on submit
    $(@input).parents("form").find("input:submit").click =>      
      @clear()
    # clear if a cancel link or similar with behavior=clear is clicked
    $(@input).parents("form").find("[data-behavior~=clear]").click =>
      @clear()
  
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
    if (old = DS.getItem @storageKey)
      unless @input.value
        @input.value = old