mediator = require 'mediator'
View = require './view'
template = require './templates/brownbag'

module.exports = class BrownbagView extends View
	# This is a workaround.
	# In the end you might want to used precompiled templates.
	template: template

	id: 'brownbag'
	containerSelector: '#content'
	autoRender: true

	shortcutScope: "j"
	shortcuts:
		"⌘ + f": "onCommandF"
		"⌘ + j":
			scope: "u"
			method: "onCommandJ"
		"⌘ + u":
			scope: "j"
			method: (event, handler) ->
				alert(handler.key)
				off

	onCommandF: (event, handler) ->
		console.debug handler.shortcut, handler.scope
		alert("f")

	onCommandJ: (event, handler) ->
		console.debug handler.shortcut, handler.scope
		alert("j")