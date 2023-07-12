$(document).ready(function() {
  let getAndDisplayAllTasks = function () {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=231',
      dataType: 'json',
      success: function (response, textStatus) {
        $('#todo-list').empty();
        response.tasks.forEach(function(task) {
          $('#todo-list').append('<div class="' + (task.display === false ? 'd-none ' : '') + 'border-bottom px-2 py-2 active"><input type="checkbox" class="mark-complete" data-id="' + task.id + '"' + (task.completed ? 'checked' : '') + '><span class="mx-2 ' + (task.completed ? 'text-complete' : '') +'">' + task.content + '</span><button class="btn btn-sm btn-outline-danger delete" data-id="' + task.id + '">Delete</button></div>');
        });
        $('#items-left').text(response.tasks.length + ' left');
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  let createTask = function() {
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=231',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#new-task-content').val()
        }
      }),
      success: function(response, textStatus) {
        $('#new-task-content').val('');
        getAndDisplayAllTasks();
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $('#create-task').on('click', '#button-create', function(e) {
    e.preventDefault();
    createTask();
  });

  $('#create-task').keypress(function(e) {
    if (e.which === 13) {
      e.preventDefault();
      createTask();
    }
  });

  let deleteTask = function(id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=231',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('click', '.delete', function() {
    deleteTask($(this).data('id'));
  });

  $(document).on('click', '#clear-completed', function(e) {
    e.preventDefault();
    $('#todo-list').children().each(function() {
      if ($(this).find('.mark-complete').prop('checked')) {
        deleteTask($(this).find('.mark-complete').data('id'));
      }
    });
  });

  let markTaskComplete = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=231',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('click', '.mark-complete', function() {
    markTaskComplete($(this).data('id'));
  });

  let markTaskActive = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=231',
      dataType:'json',
      success: function(response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('change', '.mark-complete', function() {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    } else {
      markTaskActive($(this).data('id'));
    }
  });

  let unableDisplay = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=231',
      dataType: 'json',
      data: JSON.stringify({ display: true }),
      contentType: 'application/json',
      success: function(response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  let disableDisplay = function(id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=231',
      dataType: 'json',
      data: JSON.stringify({display: false}),
      contentType: 'application/json',
      success: function(response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function(request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };
  
  $(document).on('click', '.selector', function(e) {
    e.preventDefault();
    switch ($(this).attr('id')) {
      case 'show-all':
        $('#todo-list').children().each(function() {
          unableDisplay($(this).data('id'));
        });
        break;
      case 'show-active':
        $('#todo-list').children().each(function() {
          if ($(this).find('.mark-complete').prop('checked')) {
            disableDisplay($(this).data('id'));
          } else {
            unableDisplay($(this).data('id'));
          }
        });
        break;
      case 'show-completed':
        $('#todo-list').children().each(function() {
          if (!$(this).find('.mark-complete').prop('checked')) {
            disableDisplay($(this).data('id'));
          } else {
            unableDisplay($(this).data('id'));
          }
        });
        break;
    }
    $('.selectors').children().each(function() {
      $(this).removeClass('border border-dark rounded');
    });
    $(this).addClass('border border-dark rounded');
  });

  getAndDisplayAllTasks();
});