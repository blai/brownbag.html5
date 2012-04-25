
module.exports = CSS3D =
	toNumber: (numeric, fallback) ->
		return if isNaN numeric then fallback or 0 else Number(numeric)

	translate: (t) -> " translate3d(#{t.x}px, #{t.y}px, #{t.z}px) "

	rotate: (r, revert) ->
		rX = " rotateX(#{r.x}deg) "
		rY = " rotateX(#{r.y}deg) "
		rZ = " rotateX(#{r.z}deg) "
		return if revert then rZ+rY+rX else rX+rY+rZ

	scale: (s) -> " scale (#{s}) "

	perspective: (p) -> " perspective(#{p}px) "

	computeWindowScale: (config) ->
		hScale = window.innerHeight / config.height
		wScale = window.innerWidth / config.width
		scale = Math.min hScale, wScale
		scale = config.maxScale if config.maxScale? < scale
		scale = config.minScale if config.minScale? > scale
		scale
		
Object.freeze? CSS3D

CSS3D