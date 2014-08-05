window.CellularAutomaton = {} unless CellularAutomaton?

#TODO 
#* Круговое движение
#* Документирование

class CellularAutomaton.Model
    options:
        field: [40, 40]
        states: 2
        startState: 0
        tickInterval: 100
        rules: (index, state, neighbors)->
            return null

    generation: 0
    _calcTime: 0

    constructor: (options)->
        _.extend @, Backbone.Events

        if _.isObject options
            _.extend @options, options

        @_buildField()
        @_initStates()

        @trigger 'ready'

    _buildField: ->
        field = []
        for row in [0...@options.field[0]]
            field.push new Array(@options.field[1])

        @field = field

    _initStates: (startState = @options.startState)->
        @each (index, state)->
            if @options.startState is 'random'
                @field[index[0]][index[1]] = _.random (@options.states - 1)

            else
                @field[index[0]][index[1]] = @options.startState

    _resetStates: ->
        @generation = 0
        @_initStates 0

    _runner: ->
        @nextGeneration()
        @_nextTick()

    _nextTick: ->
        @tickTimeout = setTimeout _.bind(@_runner, @), @options.tickInterval

    nextGeneration: ->
        startTick = new Date()
        changes = @calculateNextGeneration()

        for change in changes
            @setCellState change.index, change.state

        @generation++
        @_calcTime += new Date() - startTick

        @trigger 'tickComplete'

    calculateNextGeneration: (rules = @options.rules)->
        changes = []

        @each (index, state)->
            neighbors = @getCellNeighbors index
            stateUpdate = rules.call @, index, state, neighbors

            changes.push index: index, state: stateUpdate if stateUpdate?

        return changes

    getCalcTime: ->
        return @_calcTime / @generation

    each: (iterator)->
        for row, rowId in @field
            for cell, cellId in row
                iterator.call this, [rowId, cellId], cell

    setCellState: (index, state)->
        @field[index[0]][index[1]] = state
        @trigger 'change', index: index, state: state

    getCellState: (index)->
        return @field[index[0]][index[1]]

    getCellNeighbors: (index)->
        neighbors =
            left:        if @field[index[0]    ]?[index[1] - 1]? then @field[index[0]    ][index[1] - 1] else null
            rigth:       if @field[index[0]    ]?[index[1] + 1]? then @field[index[0]    ][index[1] + 1] else null
            top:         if @field[index[0] - 1]?[index[1]    ]? then @field[index[0] - 1][index[1]    ] else null
            bottom:      if @field[index[0] + 1]?[index[1]    ]? then @field[index[0] + 1][index[1]    ] else null

            leftTop:     if @field[index[0] - 1]?[index[1] - 1]? then @field[index[0] - 1][index[1] - 1] else null
            leftBottom:  if @field[index[0] + 1]?[index[1] - 1]? then @field[index[0] + 1][index[1] - 1] else null

            rigthTop:    if @field[index[0] - 1]?[index[1] + 1]? then @field[index[0] - 1][index[1] + 1] else null
            rigthBottom: if @field[index[0] + 1]?[index[1] + 1]? then @field[index[0] + 1][index[1] + 1] else null

        return neighbors

    run: ->
        unless @tickTimeout?
            @_runner()
            @trigger 'run'

    stop: ->
        if @tickTimeout?
            clearTimeout @tickTimeout
            delete @tickTimeout

        @_resetStates()
        @trigger 'stop'

    pause: ->
        if @tickTimeout?
            clearTimeout @tickTimeout
            delete @tickTimeout

            @trigger 'pause'

CellularAutomaton.Model.extend = Backbone.Model.extend
