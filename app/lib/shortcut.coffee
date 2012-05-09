KeyMaster = require 'lib/keymaster'
# inspired by Backbone.Shortcuts extension: https://github.com/bry4n/backbone-shortcuts
# Their version lost some features, so building our own
#
# Modifier keys:
# ⇧, shift, option, ⌥, alt, ctrl, control, command, ⌘
#
# Command keys:
# backspace, tab, clear, enter, return, esc, escape, space, up, down, left, right,
# home, end, pageup, pagedown, del, delete, f1 - f19

module.exports = Shortcuts =
  mapShortcuts: (keyMap) ->
    for shortcut in @parseShortcutMap(keyMap)
      shortcut.method = _.bind shortcut.method, @
      #console.debug shortcut.key, shortcut.scope, shortcut.method
      KeyMaster(shortcut.key, shortcut.scope, shortcut.method)

  parseShortcutMap: (keyMap) ->
    for key, value of keyMap
      vWrap = _(value)
      if vWrap.isString()
        "key": key
        "scope": "all"
        "method": @[value]
      else if vWrap.isFunction()
        "key": key
        "scope": "all"
        "method": value
      else if vWrap.isObject()
        value["key"] = key
        value.method = @[value.method] if _(value.method).isString()
        value

  getShortcutScope: ->
    KeyMaster.getScope()

  setShortcutScope: (scope) ->
    KeyMaster.setScope(scope)

  setShortcutFilter: (filterFunction) ->
    KeyMaster.filter = filterFunction

  deleteShortcutScope: (scope) ->
    KeyMaster.deleteScope(scope)
    
Object.freeze? Shortcuts

Shortcuts