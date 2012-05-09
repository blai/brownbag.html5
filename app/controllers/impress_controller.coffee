Controller = require './controller'
mediator = require 'mediator'
ImpressView = require 'views/impress_view'

module.exports = class ImpressController extends Controller
  #historyURL: 'brownbag'

  initialize: ->
    super
    #console.debug 'NavigationController#initialize'
    #@model = new Navigation()
    @view = new ImpressView # model: @model

