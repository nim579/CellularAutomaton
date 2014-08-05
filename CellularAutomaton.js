(function() {
  if (typeof CellularAutomaton === "undefined" || CellularAutomaton === null) {
    window.CellularAutomaton = {};
  }

  CellularAutomaton.Model = (function() {
    Model.prototype.options = {
      field: [40, 40],
      states: 2,
      startState: 0,
      tickInterval: 100,
      rules: function(index, state, neighbors) {
        return null;
      }
    };

    Model.prototype.generation = 0;

    Model.prototype._calcTime = 0;

    function Model(options) {
      _.extend(this, Backbone.Events);
      if (_.isObject(options)) {
        _.extend(this.options, options);
      }
      this._buildField();
      this._initStates();
      this.trigger('ready');
    }

    Model.prototype._buildField = function() {
      var field, row, _i, _ref;
      field = [];
      for (row = _i = 0, _ref = this.options.field[0]; 0 <= _ref ? _i < _ref : _i > _ref; row = 0 <= _ref ? ++_i : --_i) {
        field.push(new Array(this.options.field[1]));
      }
      return this.field = field;
    };

    Model.prototype._initStates = function(startState) {
      if (startState == null) {
        startState = this.options.startState;
      }
      return this.each(function(index, state) {
        if (this.options.startState === 'random') {
          return this.field[index[0]][index[1]] = _.random(this.options.states - 1);
        } else {
          return this.field[index[0]][index[1]] = this.options.startState;
        }
      });
    };

    Model.prototype._resetStates = function() {
      this.generation = 0;
      return this._initStates(0);
    };

    Model.prototype._runner = function() {
      this.nextGeneration();
      return this._nextTick();
    };

    Model.prototype._nextTick = function() {
      return this.tickTimeout = setTimeout(_.bind(this._runner, this), this.options.tickInterval);
    };

    Model.prototype.nextGeneration = function() {
      var change, changes, startTick, _i, _len;
      startTick = new Date();
      changes = this.calculateNextGeneration();
      for (_i = 0, _len = changes.length; _i < _len; _i++) {
        change = changes[_i];
        this.setCellState(change.index, change.state);
      }
      this.generation++;
      this._calcTime += new Date() - startTick;
      return this.trigger('tickComplete');
    };

    Model.prototype.calculateNextGeneration = function(rules) {
      var changes;
      if (rules == null) {
        rules = this.options.rules;
      }
      changes = [];
      this.each(function(index, state) {
        var neighbors, stateUpdate;
        neighbors = this.getCellNeighbors(index);
        stateUpdate = rules.call(this, index, state, neighbors);
        if (stateUpdate != null) {
          return changes.push({
            index: index,
            state: stateUpdate
          });
        }
      });
      return changes;
    };

    Model.prototype.getCalcTime = function() {
      return this._calcTime / this.generation;
    };

    Model.prototype.each = function(iterator) {
      var cell, cellId, row, rowId, _i, _len, _ref, _results;
      _ref = this.field;
      _results = [];
      for (rowId = _i = 0, _len = _ref.length; _i < _len; rowId = ++_i) {
        row = _ref[rowId];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (cellId = _j = 0, _len1 = row.length; _j < _len1; cellId = ++_j) {
            cell = row[cellId];
            _results1.push(iterator.call(this, [rowId, cellId], cell));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Model.prototype.setCellState = function(index, state) {
      this.field[index[0]][index[1]] = state;
      return this.trigger('change', {
        index: index,
        state: state
      });
    };

    Model.prototype.getCellState = function(index) {
      return this.field[index[0]][index[1]];
    };

    Model.prototype.getCellNeighbors = function(index) {
      var neighbors, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      neighbors = {
        left: ((_ref = this.field[index[0]]) != null ? _ref[index[1] - 1] : void 0) != null ? this.field[index[0]][index[1] - 1] : null,
        rigth: ((_ref1 = this.field[index[0]]) != null ? _ref1[index[1] + 1] : void 0) != null ? this.field[index[0]][index[1] + 1] : null,
        top: ((_ref2 = this.field[index[0] - 1]) != null ? _ref2[index[1]] : void 0) != null ? this.field[index[0] - 1][index[1]] : null,
        bottom: ((_ref3 = this.field[index[0] + 1]) != null ? _ref3[index[1]] : void 0) != null ? this.field[index[0] + 1][index[1]] : null,
        leftTop: ((_ref4 = this.field[index[0] - 1]) != null ? _ref4[index[1] - 1] : void 0) != null ? this.field[index[0] - 1][index[1] - 1] : null,
        leftBottom: ((_ref5 = this.field[index[0] + 1]) != null ? _ref5[index[1] - 1] : void 0) != null ? this.field[index[0] + 1][index[1] - 1] : null,
        rigthTop: ((_ref6 = this.field[index[0] - 1]) != null ? _ref6[index[1] + 1] : void 0) != null ? this.field[index[0] - 1][index[1] + 1] : null,
        rigthBottom: ((_ref7 = this.field[index[0] + 1]) != null ? _ref7[index[1] + 1] : void 0) != null ? this.field[index[0] + 1][index[1] + 1] : null
      };
      return neighbors;
    };

    Model.prototype.run = function() {
      if (this.tickTimeout == null) {
        this._runner();
        return this.trigger('run');
      }
    };

    Model.prototype.stop = function() {
      if (this.tickTimeout != null) {
        clearTimeout(this.tickTimeout);
        delete this.tickTimeout;
      }
      this._resetStates();
      return this.trigger('stop');
    };

    Model.prototype.pause = function() {
      if (this.tickTimeout != null) {
        clearTimeout(this.tickTimeout);
        delete this.tickTimeout;
        return this.trigger('pause');
      }
    };

    return Model;

  })();

  CellularAutomaton.Model.extend = Backbone.Model.extend;

}).call(this);

(function() {
  if (typeof CellularAutomaton === "undefined" || CellularAutomaton === null) {
    window.CellularAutomaton = {};
  }

  CellularAutomaton.View = Backbone.View.extend({
    events: {
      "click .ca-cell": "toggleState",
      "click .jsRun": "run",
      "click .jsPause": "pause",
      "click .jsStop": "stop",
      "click .jsTick": "nextTick"
    },
    initialize: function() {
      this.render();
      this.listenTo(this.model, 'stop', this.render);
      return this.listenTo(this.model, 'change', this.updateState);
    },
    render: function() {
      var $field, $row, cell, cellId, cells, row, rowId, _i, _j, _len, _len1, _ref;
      $field = $('<table class="ca-table"></table>');
      _ref = this.model.field;
      for (rowId = _i = 0, _len = _ref.length; _i < _len; rowId = ++_i) {
        row = _ref[rowId];
        $row = $('<tr></tr>');
        cells = [];
        for (cellId = _j = 0, _len1 = row.length; _j < _len1; cellId = ++_j) {
          cell = row[cellId];
          cells.push($("<td><div class=\"ca-cell ca-state_" + cell + "\" id=\"cell_" + rowId + "_" + cellId + "\"></div></td>"));
        }
        $row.html(cells);
        $field.append($row);
      }
      return this.$el.find('.jsField').html($field);
    },
    updateState: function(changes) {
      return $("#cell_" + changes.index[0] + "_" + changes.index[1], this.el).removeClass("ca-state_0 ca-state_1").addClass("ca-state_" + changes.state);
    },
    toggleState: function(e) {
      var currentState, id, index, newState, parsedId;
      id = $(e.currentTarget).attr('id');
      parsedId = id.match(/cell_([0-9]+)_([0-9]+)/);
      index = [Number(parsedId[1]), Number(parsedId[2])];
      currentState = this.model.getCellState(index);
      newState = 0;
      if (currentState === 0) {
        newState = 1;
      }
      return this.model.setCellState(index, newState);
    },
    run: function(e) {
      e.preventDefault();
      this.model.run();
      return false;
    },
    pause: function(e) {
      e.preventDefault();
      this.model.pause();
      return false;
    },
    stop: function(e) {
      e.preventDefault();
      this.model.stop();
      return false;
    },
    nextTick: function(e) {
      e.preventDefault();
      this.model.nextGeneration();
      return false;
    }
  });

}).call(this);
