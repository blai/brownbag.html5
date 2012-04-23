Controller = require './controller'
mediator = require 'mediator'
BrownbagView = require 'views/brownbag_view'

module.exports = class BrownbagController extends Controller
  historyURL: 'brownbag'

  initialize: ->
    super
    #console.debug 'NavigationController#initialize'
    #@model = new Navigation()
    @view = new BrownbagView # model: @model

