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

	lastHash: null

	initialize: false

	stepEnterTimeout: null

	defaults:
		width: 1024
		height: 768
		maxScale: 1
		minScale: 0
		perspective: 1000
		transitionDuration: 1000

	shortcuts:
		'left': 'prev'
		'right': 'next'
		'⌥ + n': 'next'


	initialize: ->
		@config = _.defaults @el.dataset, @defaults

		@windowScale = @computeWindowScale @config
		@isSupport()

		@initCanvas()
		@adjustStyles @config, @windowScale

		@steps = @$ ".step"
		@steps.each (index, element) =>
			@initStep element, index

		@currentState = 
			translate: { x: 0, y: 0, z: 0 }
			rotate: { x: 0, y: 0, z: 0 }
			scale: 1

		@$el.trigger "impress:init"
		@initStepStates()
		@initEnv()

		super

	isSupport: ->
		body = document.body
		ua = navigator.userAgent.toLowerCase()
		impressSupported = (@pfx "perspective") isnt null and body.classList and body.dataset

		$body = $(body)
		if impressSupported
			$body.removeClass "impress-not-supported"
			$body.addClass "impress-supported"
			yes
		else
			$body.addClass "impress-not-supported"
			no

	initCanvas: ->
		@$(".step").wrapAll @make "div", id: "stepCanvas"
		@$canvas = @$ "#stepCanvas"
		@canvas = @$canvas[0]


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
		_.extend rootStyles,
			top: "50%"
			left: "50%"
			transform: @perspective(config.perspective/windowScale) + @scale windowScale

		@$el.css rootStyles



	onStepEnter: (step) ->
		if lastEntered isnt step
			@$(step).trigger "impress:stepenter"
			lastEntered = step

	onStepLeave: (step) ->
		if lastEntered is step
			@$(step).trigger "impress:stepleave"
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

		@stepsData["impress-" + el.id] = step

		$(el).css
			position: "absolute"
			transform: "translate(-50%, -50%)#{@translate step.translate}#{@rotate step.rotate}#{@scale step.scale}"
			transformStyle: "preserve-3d"

	getStep: (step) ->
		if _(step).isNumber()
			step = if step < 0 then @steps[ @steps.length + step ] else @steps[ step ]
		else if _(step).isString()
			step = (@$ step)[0]
		else if step instanceof jQuery
			step = step[0]

		return if step?.id and @stepsData["impress-#{step.id}"] then step else null

	goto: (el, duration) ->
		return false unless el = @getStep el

		window.scrollTo 0, 0

		step = @stepsData["impress-#{el.id}"]
		$el = @$ el
		$body = $ document.body

		if @activeStep
			$activeStep = @$ @activeStep
			$activeStep.removeClass "active"
			$body.removeClass "impress-on-#{@activeStep.id}"

		$el.addClass "active"
		$body.addClass "impress-on-#{el.id}"

		target = 
			rotate:
				x: -step.rotate.x
				y: -step.rotate.y
				z: -step.rotate.z
			translate:
				x: -step.translate.x
				y: -step.translate.y
				z: -step.translate.z
			scale: 1 / step.scale

		zoomin = target.scale >= @currentState.scale
		duration = @toNumber duration, @config.transitionDuration
		delay = duration / 2

		@windowScale = @computeWindowScale @config if el is @activeStep
		targetScale = target.scale * @windowScale

		@onStepLeave @activeStep if @activeStep? isnt el

		@$el.css 
			transform: (@perspective @config.perspective / targetScale) + (@scale targetScale)
			transitionDuration: duration + "ms"
			transitionDelay: (if zoomin then delay else 0) + "ms"

		@$canvas.css
			transform: (@rotate target.rotate, true) + (@translate target.translate)
			transitionDuration: duration + "ms"
			transitionDelay: (if zoomin then 0 else delay) + "ms"

		currentStateValues = [
			@currentState.scale
			@currentState.rotate.x
			@currentState.rotate.y
			@currentState.rotate.z
			@currentState.translate.x
			@currentState.translate.y
			@currentState.translate.z
		]
		targetValues = [
			target.scale
			target.rotate.x
			target.rotate.y
			target.rotate.z
			target.translate.x
			target.translate.y
			target.translate.z
		]
		delay = 0 unless currentStateValues > targetValues or targetValues > currentStateValues

		@currentState = target
		@activeStep = el

		clearTimeout @stepEnterTimeout
		@stepEnterTimeout = setTimeout (=> @onStepEnter @activeStep), duration + delay

		el

	prev: ->
		prev = @steps.index(@activeStep) - 1
		prev = if prev >= 0 then @steps[prev] else @steps[@steps.length-1]
		@goto prev

	next: ->
		next = @steps.index(@activeStep) + 1
		next = if next < @steps.length then @steps[next] else @steps[0]
		@goto next

	initStepStates: ->
		# first part
		@$(step).addClass "future" for step in @steps

		@delegate "impress:stepenter", @enterStep
		@delegate "impress:stepleave", @leaveStep

		el = @$ window.location.hash.replace /^#\/?/
		el = if el.length == 0 then @steps[0] else el[0]
		@goto el, 0

	initEnv: ->
		$w = $ window
		$w.on "resize", _.throttle(@onResize, 250)
		$w.on "hashchange", @onHashchange


	enterStep: (event) ->
		$step = @$ event.target
		$step.removeClass "past"
		$step.removeClass "future"
		$step.addClass "present"
		window.location.hash = "#/#{event.target.id}"

	leaveStep: (event) ->
		$step = @$ event.target
		$step.removeClass "present"
		$step.addClass "past"

	onResize: (event) =>
		@goto @activeStep, 500

	onHashchange: (event) =>
		step = window.location.hash.replace /^#\/?/, ""
		@goto step, 0













  
