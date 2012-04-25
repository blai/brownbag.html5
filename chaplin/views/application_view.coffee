mediator = require 'mediator'
utils = require 'chaplin/lib/utils'
Subscriber = require 'chaplin/lib/subscriber'

module.exports = class ApplicationView # This class does not extend View

  # Mixin a Subscriber
  _(ApplicationView.prototype).extend Subscriber

  # The site title used in the document title
  title: ''

  constructor: (options = {}) ->
    #console.debug 'ApplicationView#constructor', options

    @title = options.title

    # Listen to global events

    # Starting and disposing of controllers
    @subscribeEvent 'beforeControllerDispose', @hideOldView
    @subscribeEvent 'startupController', @showNewView
    @addDOMHandlers()

  # Controller startup and disposal
  # -------------------------------

  # Handler for the global beforeControllerDispose event
  hideOldView: (controller) ->
    # Jump to the top of the page
    scrollTo 0, 0

    # Hide the current view
    view = controller.view
    if view
      view.$el.css 'display', 'none'

  # Handler for the global startupController event
  # Show the new view
  showNewView: (context) ->
    view = context.controller.view
    if view
      view.$el.css display: 'block', opacity: 1, visibility: 'visible'

  # DOM Event handling
  # ------------------

  addDOMHandlers: ->
    # Handle links
    $(document)
      .delegate('.go-to', 'click', @goToHandler)
      .delegate('a', 'click', @openLink)

  # Handle all clicks on A elements and try to route them internally
  openLink: (event) =>
    #console.debug 'ApplicationView#openLink'
    return if utils.modifierKeyPressed(event)

    el = event.currentTarget
    href = el.getAttribute 'href'
    # Ignore empty path even if it is a valid relative URL
    return if href is '' or href.charAt(0) is '#'

    # Is it an external link?
    currentHostname = location.hostname.replace('.', '\\.')
    hostnameRegExp = ///#{currentHostname}$///i
    external = not hostnameRegExp.test(el.hostname)
    if external
      #console.debug 'ApplicationView#openLink: external link', el.hostname
      # Open external links normally
      # You might want to enforce opening in a new tab here:
      #event.preventDefault()
      #window.open el.href
      return

    @openInternalLink event

  # Try to route a click on a link internally
  openInternalLink: (event) ->
    #console.debug 'ApplicationView#openInternalLink'
    return if utils.modifierKeyPressed(event)

    el = event.currentTarget
    path = el.pathname
    return unless path

    # Pass to the router, try to route internally
    mediator.publish '!router:route', path, (routed) ->
      #console.debug 'ApplicationView#openInternalLink routed:', routed
      # Prevent default handling if the URL could be routed
      event.preventDefault() if routed
      # Otherwise navigate to the URL normally

  # Not only A elements might act as internal links,
  # every element might have:
  # class="go-to" data-href="/something"
  goToHandler: (event) ->
    #console.debug 'ApplicationView#goToHandler'
    el = event.currentTarget

    # Do not handle A elements
    return if event.nodeName is 'A'

    path = $(el).data('href')
    # Ignore empty path even if it is a valid relative URL
    return unless path

    # Pass to the router, try to route internally
    mediator.publish '!router:route', path, (routed) ->
      #console.debug 'ApplicationView#goToHandler routed:', routed
      if routed
        # Prevent default handling if the URL could be routed
        event.preventDefault()
      else
        # Navigate to the URL normally
        location.href = path

  # Disposal
  # --------

  disposed: false

  dispose: ->
    return if @disposed

    @unsubscribeAllEvents()

    delete @title

    @disposed = true

    # Your're frozen when your heart’s not open
    Object.freeze? this
