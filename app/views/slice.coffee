mediator = require 'mediator'
View = require './view'
#template = require './templates/stats'

module.exports = class SliceView extends View
  className: 'step'
  containerSelector: '#impress'

  initialize: ->
    super
    @subscribeEvent 'loginStatus', @loginStatusHandler
    @subscribeEvent 'userData', @render

  loginStatusHandler: (loggedIn) =>
    if loggedIn
      @model = mediator.user
    else
      @model = null
    @render()
