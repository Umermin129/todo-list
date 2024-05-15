$(document).ready(function () {
    const API_URL = "https://jsonplaceholder.typicode.com/todos";

    let todos = [];

    function fetchTodos() {
        $.get(API_URL, function (data) {
            todos = data.slice(0, 10);
            renderTodos();
        });
    }

    function renderTodos() {
        let tableBody = $("#todoTable tbody");
        tableBody.empty();
        todos.forEach(function (todo) {
            let row = $("<tr></tr>")
                .data("id", todo.id)
                .append($("<td></td>").text(todo.id))
                .append($("<td></td>").text(todo.title))
                .append($("<td></td>").text(todo.completed));
            let actionsCell = $("<td></td>");
            let editBtn = $("<button>Edit</button>").addClass("btn btn-sm btn-warning edit-btn");
            let deleteBtn = $("<button>Delete</button>").addClass("btn btn-sm btn-danger delete-btn");
            actionsCell.append(editBtn).append(" ").append(deleteBtn);
            row.append(actionsCell);
            tableBody.append(row);
        });
    }

    function getTodoById(id) {
        return todos.find(function (todo) {
            return todo.id === id;
        });
    }

    function addTodo() {
        let title = $("#title").val();
        let completed = $("#completed").prop("checked");
        
        // Clear any validation messages
        $("#title").removeClass("is-invalid");
        $("#title-error").remove();

        // Validate title input
        if (title.length < 1) {
            $("#title").addClass("is-invalid");
            $("#title").after("<div id='title-error' class='invalid-feedback'>Please enter a title.</div>");
            return;
        }

        let newTodo = {
            id: todos.length + 1,
            title: title,
            completed: completed,
        };

        todos.push(newTodo);
        renderTodos();
        $("#todoForm")[0].reset();
    }

    function updateTodo() {
        let id = $("#todoId").val();
        let title = $("#title").val();
        let completed = $("#completed").prop("checked");

        todos = todos.map(function (todo) {
            if (todo.id === parseInt(id)) {
                return {
                    id: todo.id,
                    title: title,
                    completed: completed,
                };
            } else {
                return todo;
            }
        });

        renderTodos();
        $("#todoForm")[0].reset();
        $("#submitBtn").show();
        $("#updateBtn").hide();
        $("#todoId").val("");
    }

    function deleteTodoById(id) {
        todos = todos.filter(function (todo) {
            return todo.id !== parseInt(id);
        });

        renderTodos();
    }

    fetchTodos();

    $("#toggleFormBtn").click(function () {
        $("#todoForm").slideToggle();
    });

    $("#todoForm").submit(function (event) {
        event.preventDefault();

        let id = $("#todoId").val();

        if (id) {
            updateTodo();
        } else {
            addTodo();
        }
    });

    $("#updateBtn").click(function () {
        $("#todoForm").submit();
    });

    $("#submitBtn").click(function () {
        $("#todoForm").submit();
    });
    $("#todoTable").on("click", ".edit-btn", function () {
        let row = $(this).closest("tr");
        let id = row.data("id");
        let todo = getTodoById(id);
    
        $("#todoId").val(todo.id);
        $("#title").val(todo.title);
        $("#completed").prop("checked", todo.completed);
        $("#submitBtn").hide();
        $("#updateBtn").show();
        $("#todoForm").slideDown();
    });
    
    $("#todoTable").on("click", ".delete-btn", function () {
        let id = $(this).closest("tr").data("id");
        deleteTodoById(id);
    });
    
    function sortTodos(column, desc = false) {
        todos.sort(function(a, b) {
            let comparison = 0;
            
            if (column === 'id') {
                comparison = a.id - b.id;
            } else if (column === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (column === 'completed') {
                comparison = a.completed - b.completed;
            }
            
            return desc ? -comparison : comparison;
        });
        
        renderTodos();
    }
    
    // Add this line to reset the click event listeners on the table headers
    $("#todoTable thead th").off("click");
    
    // Add click event listeners for sorting on table headers
    $("#todoTable thead th").click(function() {
        let column = $(this).text().toLowerCase();
        let desc = !$(this).data("desc");
        sortTodos(column, desc);
        $(this).data("desc", desc);
    });
    
})