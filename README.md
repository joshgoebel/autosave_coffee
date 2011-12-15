AutoSave.coffee
===============

CoffeeScript implementation of autosave for any input field using the 
browsers own localStorage object.

## Building autosave.js

Just run "rake" or "make".

## Using on the Browser side at page load time

You'll need both JQuery and autosave.js:

    <script src="/js/jquery.js" type="text/javascript"></script>
    <script src="/js/autosave.js" type="text/javascript"></script>
    <!-- meta tag that holds user_id here optionally -->
    <form action="/notes/" method="post">
      <input type="text" name="note[title]" data-behavior="autosave" />
      <textarea name="note[body]" data-behavior="autosave"></textarea>
      <input type="submit" value="Save me!" />
      <a href="/cancel" data-behavior="clear">Cancel</a>
    </form>

Both the title and body fields will be autosaved... if the form is submitted
the autosave value will be cleared... and if an element with the behavior 
"clear" is clicked then the autosave value will also be cleared.
    
## Using via AJAX with Rails, etc

You're new email RJS template might look like this:

    page.replace_html :blankdiv, :partial => "emails/new"
    page << "AutoSave.enable($jQuery('#blankdiv'))"
    
After the content is loaded you have to throw the parent object to AutoSave
so it can search for any new fields that it needs to enable AutoSave on.
    
## Defining a unique hash key

Since localStorage is a simple key based storage system we'll need a different
storage key for every single location inside your app where you want to enable
autosave. It's up to you to figure this out based on your own needs, but the
default implementation builds the key by joining all these pieces of info:

* current_user (if available via meta tag - see below)
* name attribute of the input/textarea tag
* the action attribute of the parent form
* the current browser URL

### Including your apps unique user ID in the hash

You'll likely want to store the user ID somewhere in Javascript or HTML so
that you can get to it to build a unique hash key.  For Rails your template
might look like this:

    <meta name="current_user" content="<%= current_user.try(:id) %>">

This would prevent two users on the same computer from ever seeing each
others auto-complete text, even if they were working on the same pages and
objects in your app.

#### Wrapping this is a quick class

I define a default Meta class that looks like this.  This is entirely optional
and if you don't like it feel free to yank it and inline that code inside
the AutoSave class itself.

    class Meta
      cu = $("meta[name=current_user]")[0]
      @current_user = if cu then cu.content else null
      
And inside autosave.coffee you would access current user via:

    Meta.current_user

You app might not even need current user as part of the hash... tweak to your
own liking.  The above is just the default.