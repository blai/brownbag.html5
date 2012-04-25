mediator = require 'mediator'
View = require './view'
CSS3D = require 'lib/css3d'

module.exports = class ImpressView extends View
	# mixin CSS3D
	_(ImpressView.prototype).extend CSS3D
	
	el: "#impress"

	canvas: null
	$canvas: null

	stepsData: {}

	activeStep: null

	currentState: null

	steps: null

	config: null

	windowScale: null

	lastEntered: null

	initialize: false

	defaults:
		width: 1024
		height: 768
		maxScale: 1
		minScale: 0
		perspective: 1000
		transitionDuration: 1000


	initialize: ->
		config = _.defaults @$el.dataset, @defaults

		windowScale = @computeWindowScale config

		@initCanvas()
		@adjustStyles config, windowScale

		@$(".step").each (index, element) =>
			@initStep element

		currentState = 
			translate: { x: 0, y: 0, z: 0 }
			rotate: { x: 0, y: 0, z: 0 }
			scale: 1

		@$el.trgger "impress:init"

		super

	initCanvas: ->
		@canvas = make "div"
		@$(".step").wrapAll @canvas
		@$canvas = @$ @canvas


	adjustStyles: (config, windowScale) ->
		$body = $("body")

		$(document).css
			"height": "100%"

		$body.removeClass "impress-disabled"
		$body.addClass "impress-enabled"
		$body.css
			height: "100%"
			overflow: "hidden"

		# adjust style for @$canvas
		rootStyles =
			position: "absolute"
			transformOrigin: "top left"
			transition: "all 0s ease-in-out"
			transformStyle: "preserve-3d"

		@$canvas.css rootStyles

		# adjust style for @$el
		_.extend rootStyles
			top: "50%"
			left: "50%"
			transform: @perspective(config.perspective/windowScale) + @scale windowScale

		@$el.css rootStyles



	onStepEnter: (step) ->
		if lastEntered isnt step
			$(step).trigger "impress:stepenter"
			lastEntered = step

	onStepLeave: (step) ->
		if lastEntered is step
			$(step).trigger "impress:stepleave"
			lastEntered = null

	initStep: (el, idx) ->
		data = el.dataset
		step =
			translate:
				x: @toNumber data.x
				y: @toNumber data.y
				z: @toNumber data.z
			rotate:
				x: @toNumber data.rotateX
				y: @toNumber data.rotateY
				z: @toNumber data.rotateZ || data.rotate
			scale: @toNumber data.scale, 1
			el: el

		el.id = "step-" + (idx + 1) unless el.id

		stepsData["impress-" + el.id] = step

		$(el).css
			position: "absolute"
			transform: "translate(-50%, -50%)#{@translate step.translate}#{@rotate step.rotate}#{@scale step.scale}"
			transformStyle: "preserve-3d"







  
