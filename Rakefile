task "default" => ["autosave.js"]

file "autosave.js" => ["autosave.coffee"] do
  `coffee -c autosave.coffee `
end
  