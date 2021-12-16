var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");

var tasksToDoEl = document.querySelector("#tasks-to-do");

//target main tav
var pageContentEl = document.querySelector("#page-content");

var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl =document.querySelector("#tasks-completed");

/* --------------FUNCTION to get data and pass to task creation ----------*/
var taskFormHandler = function() {
   /*stop page from refreshing*/
    event.preventDefault();
  /* get input name value */
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

   /*check if input is empty*/
   if (!taskNameInput || !taskTypeInput) {
       alert("You need to fill out the task form!");
       return false;
   }

   /* reset form input */
   formEl.reset();


   //check if task is edit
   var isEdit = formEl.hasAttribute("data-task-id");
   
   if (isEdit) {
       var taskId = formEl.getAttribute("data-task-id");
       completeEditTask(taskNameInput, taskTypeInput, taskId);
   }
   else {
       var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
       };
   
  /* send data to create task */
  createTaskEl(taskDataObj);
};
};

/* ---------Function to create task ---------*/
var createTaskEl = function(taskDataObj) {

/*----creat list item----*/
var listItemEl = document.createElement("li");
listItemEl.className = "task-item";

/*-add task id as a custom attribute */
listItemEl.setAttribute("data-task-id", taskIdCounter);

/*create div to hold task info and add to list item*/
var taskInfoEl = document.createElement("div");
taskInfoEl.className = "task-info";
taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
listItemEl.appendChild(taskInfoEl);  

//create action btn based on task id
var taskActionsEl = createTaskActions(taskIdCounter);
listItemEl.appendChild(taskActionsEl);

/* add entire list item to list*/
tasksToDoEl.appendChild(listItemEl);

/*increease task counter for next uniq id */
taskIdCounter++;
};


/* Function to get task id then crate actions */
var createTaskActions = function(taskId) {
    //create div for action items//
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

   //create edit btn
   var editButtonEl = document.createElement("button");
   editButtonEl.textContent = "Edit";
   editButtonEl.className = "btn edit-btn";
   editButtonEl.setAttribute("data-task-id", taskId);
   actionContainerEl.appendChild(editButtonEl);

   //create delete button
   var deleteButtonEl = document.createElement("button");
   deleteButtonEl.textContent = "Delete";
   deleteButtonEl.className = "btn delete-btn";
   deleteButtonEl.setAttribute("data-task-id", taskId);
   actionContainerEl.appendChild(deleteButtonEl);

   //create dropdown element
   var statusSelectEl = document.createElement("select");
   statusSelectEl.setAttribute("name", "status-change");
   statusSelectEl.setAttribute("data-task-id", taskId);
   statusSelectEl.className = "select-status";
   actionContainerEl.appendChild(statusSelectEl);

   //status array
   var statusChoices = ["To Do", "In Progress", "Completed"];
   for (var i = 0; i < statusChoices.length; i++) {
       //create option element
       var statusOptionEl = document.createElement("option");
       statusOptionEl.setAttribute("value", statusChoices[i]);
       statusOptionEl.textContent = statusChoices[i];
       statusSelectEl.appendChild(statusOptionEl);
   }

   return actionContainerEl;
};

/* evenlistener call createTaskHandle function when btn clicked */

//Function for edited task
var completeEditTask = function(taskName, taskType, taskId) {
    
    //get matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values 
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent ="Add Task";
};


//Function for task btns
var taskButtonHandler = function(event) {
   //get target element
   var targetEl = event.target;
       //get edit btn
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
       //target delete btn
    else if (targetEl.matches(".delete-btn")) {
       //get task id
       var taskId = targetEl.getAttribute("data-task-id");
       deleteTask(taskId);
    }
};

//Function to edit task
var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    //get task list items
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    formEl.setAttribute("data-task-id", taskId);
    document.querySelector("#save-task").textContent = "Save Task";  
};

//Function to delete task
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

//Function for change event
var taskStatusChangeHandler = function(event) {
   //get the task item's id
   var taskId = event.target.getAttribute("data-task-id");
   //get the currently selected option's value and convert to lowercase
   var statusValue = event.target.value.toLowerCase();
   //find the parent task item element based on the id
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   //move task to selected list
   if (statusValue === "to do") {
       tasksToDoEl.appendChild(taskSelected);
   } else if (statusValue === "in progress") {
       tasksInProgressEl.appendChild(taskSelected);
   } else if (statusValue === "completed") {
       tasksCompletedEl.appendChild(taskSelected);
   }
   
};

//create task
formEl.addEventListener("submit", taskFormHandler);
//call taskButttonHandler when clicked
pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);