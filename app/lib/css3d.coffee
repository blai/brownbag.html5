
module.exports = CSS3D =
	toNumber: (numeric, fallback) ->
		return if isNaN numeric then fallback or 0 else Number(numeric)

	translate: (t) -> " translate3d(#{t.x}px,#{t.y}px,#{t.z}px) "

	rotate: (r, revert) ->
		rX = " rotateX(#{r.x}deg) "
		rY = " rotateY(#{r.y}deg) "
		rZ = " rotateZ(#{r.z}deg) "
		return if revert then rZ+rY+rX else rX+rY+rZ

	scale: (s) -> " scale(#{s}) "

	perspective: (p) -> " perspective(#{p}px) "

	computeWindowScale: (config) ->
		hScale = window.innerHeight / config.height
		wScale = window.innerWidth / config.width
		scale = Math.min hScale, wScale
		scale = config.maxScale if config.maxScale and config.maxScale < scale
		scale = config.minScale if config.minScale and config.minScale > scale
		scale

	pfx: do ->
		style = document.createElement("dummy").style
		prefixes = "Webkit Moz 0 ms Khtml".split(" ")
		memory = {}

		(prop) ->
			if typeof memory[prop] is "undefined"
				ucProp = prop.charAt(0).toUpperCase() + prop.substr(1)
				props = (prop + " " + prefixes.join(ucProp + " ") + ucProp).split(" ")

				memory[prop] = null
				for i of props
					if style[props[i]] isnt undefined
						memory[prop] = props[i]
						break

			memory[prop]
		
Object.freeze? CSS3D

#"translate(-50%,-50%) translate3d(-1000px,-1500px,0px)  rotateX(0deg)  rotateY(0deg)  rotateZ(0deg)  scale(1) "
CSS3D