var db = require("./db");
var _ = require("lodash");
var $ = require("jquery");

var ViewModel = function (taskName) {
  var self = this;
  this.tasks = ko.observableArray([]);

  this.completedTasks = ko.observableArray([]);

  db.establishConnection();

  db.getTasks(function (tasks) {
    self.tasks(tasks); 
  }); 

  this.task = ko.observable(taskName);
  this.completed = ko.observable(false);

  this.addTask = function (item, event) {
    if (event.keyCode === 13) {
      db.addTask({"name": this.task(), "completed": this.completed() });
      this.task("");
    } else {
      return true;
    }
  };

  this.removeTask = function () {
    var completedTasks =_.filter(self.tasks(), function (task) {
      return task.completed;
    });

    self.tasks.removeAll(completedTasks);
    db.removeCompletedTasks(completedTasks);
  };

  this.markAsDone = function (item, event) {
    var span = $(event.target).prev('span');
    span.toggleClass('completedtask');
    db.update(item, { "name": item.name, "completed": item.completed }); 
    return true;
  };

  this.removeAll = function () {
    db.removeAll();
    location.reload();
  };
};

ko.applyBindings(new ViewModel(""));
