ChaplinView = require 'chaplin/views/view'
Shortcut = require 'lib/shortcut'

module.exports = class View extends ChaplinView
	# mixin Shortcut
	_(View.prototype).extend Shortcut
	# local Shortcut params
	shortcutScope: "all"
	$lastShortcutScope: "all"
	shortcuts: null

	initialize: (options) ->
		# overrides local params with runtime options
		@shortcutScope or= options?.shortcutScope
		@shortcuts or= options?.shortcuts
		# setup key shortcuts
		@initShortcuts()
		super

	initShortcuts: ->
		@mapShortcuts @shortcuts
		console.debug @delegate("focusin", @onFocusIn)
		console.debug @delegate("focusout", @onFocusOut)
		@

	onFocusIn: (event) ->
		console.debug "focusin: set shortcut scope to: ", @shortcutScope
		@$lastShortcutScope = @getShortcutScope()
		@setShortcutScope @shortcutScope

	onFocusOut: (event) ->
		console.debug "focusin: set shortcut scope to: ", @$lastShortcutScope
		@setShortcutScope @$lastShortcutScope