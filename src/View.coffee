window.CellularAutomaton = {} unless CellularAutomaton?

#TODO
#* Вынести все названия в настройки
#* Переделать рендер
#* Добавть правильное очищение классов
#* Документирование

CellularAutomaton.View = Backbone.View.extend
    events:
        "click .ca-cell": "toggleState"
        "click .jsRun": "run"
        "click .jsPause": "pause"
        "click .jsStop": "stop"
        "click .jsTick": "nextTick"

    initialize: ->
        @render()

        @listenTo @model, 'stop', @render
        @listenTo @model, 'change', @updateState

    render: ->
        $field = $('<table class="ca-table"></table>')

        for row, rowId in @model.field
            $row = $('<tr></tr>')
            cells = []

            for cell, cellId in row
                cells.push $("<td><div class=\"ca-cell ca-state_#{cell}\" id=\"cell_#{rowId}_#{cellId}\"></div></td>")

            $row.html cells
            $field.append $row

        @$el.find('.jsField').html $field

    updateState: (changes)->
        $("#cell_#{changes.index[0]}_#{changes.index[1]}", @el)
        .removeClass "ca-state_0 ca-state_1"
        .addClass "ca-state_#{changes.state}"

    toggleState: (e)->
        id = $(e.currentTarget).attr('id')
        parsedId = id.match /cell_([0-9]+)_([0-9]+)/

        index = [Number(parsedId[1]), Number(parsedId[2])]

        currentState = @model.getCellState index
        newState = 0

        if currentState is 0
            newState = 1

        @model.setCellState index, newState

    run: (e)->
        e.preventDefault()
        @model.run()

        return false

    pause: (e)->
        e.preventDefault()
        @model.pause()

        return false

    stop: (e)->
        e.preventDefault()
        @model.stop()

        return false

    nextTick: (e)->
        e.preventDefault()
        @model.nextGeneration()

        return false
