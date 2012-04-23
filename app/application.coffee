mediator = require 'mediator'
Application = require 'chaplin/application'
BrownbagController = require 'controllers/brownbag_controller'
routes = require 'routes'
support = require 'chaplin/lib/support'

# The application bootstrapper.
module.exports = class BrownbagApplication extends Application
  title: 'Siberia Brownbag'

  initialize: ->
    super # This creates the AppController and AppView

    # Instantiate common controllers
    # ------------------------------

    new BrownbagController()

    # Initialize the router
    # ---------------------

    # This creates the mediator.router property and
    # starts the Backbone history.
    @initRouter routes, pushState: no

    # Object sealing
    # --------------

    # Seal the mediator object (prevent extensions and
    # make all properties non-configurable)
    if support.propertyDescriptors and Object.seal
      Object.seal mediator

    # Freeze the application instance to prevent further changes
    Object.freeze? this
