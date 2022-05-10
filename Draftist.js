/**
 * Draftist Action Group Functions
 * @author FlohGro
 * @copyright 2022, FlohGro
 * @licensing MIT free to use - but donate coffees to support development http://www.flohgro.com/donate
 * @version 0.1
 */


/**
 * Draftist_checkTodoistForError - This function checks the provided Todoist Object for errors.
 * If an error was detected it will be returned, otherwise undefined will be returned.
 * @param {Todoist_Object} todoist_obj the todoist object to check
 * @returns {error | undefined} a present error or undefined
 */
function Draftist_getLastTodoistError(todoistObj) {
  let error = todoistObj.lastError
  if (error) {
    return error;
  } else {
    return undefined;
  }
}

/**
 * Draftist_succeedAction - notifies the user about a successful execution of an action
 *
 * @param  {String} actionName      the name of the action (might be empty if not displayed)
 * @param  {Boolean} displayActionName bool if the provided name of the action shall be displayed or not
 * @param  {String} successMessage    the content for the success message
 */
function Draftist_succeedAction(actionName, displayActionName, successMessage) {
  app.displaySuccessMessage((displayActionName ? actionName + " succeeded: " : "") + successMessage);
}

/**
 * Draftist_cancelAction - This function notifies the user which action was canceled and why.
 * @param {String} actionName the name of the actionName
 * @param {String} cancelReasonDescription description why the action was cancelled
 */
function Draftist_cancelAction(actionName, cancelReasonDescription) {
  context.cancel(actionName + " was cancelled: " + cancelReasonDescription);
  app.displayWarningMessage(actionName + " was cancelled: " + cancelReasonDescription);
}

/**
 * Draftist_failAction - This function notifies the user when an action failed and why.
 * @param {String} actionName the name of the actionName
 * @param {String} failedReasonDescription description why the action failed
 */
function Draftist_failAction(actionName, failedReasonDescription) {
  context.fail(actionName + " failed: " + failedReasonDescription);
  alert(actionName + " failed: " + failedReasonDescription);
}

/**
 * Draftist_infoMessage - displays a info message to the user prepended with "Draftist: "
 *
 * @param  {String} actionName      the name of the action (might be empty if not displayed)
 * @param  {String} successMessage    the content for the info message
 */
function Draftist_infoMessage(actionName, infoMessage) {
  app.displayInfoMessage("Draftist: " + infoMessage + (actionName.length > 0 ? "(" + actionName + ")" : ""));
}

/**
 * Draftist_quickAdd - This function adds the provided string to Todoist using the quickAdd API.
 * This supports the Todoist natural language which will be processed by Todoist automatically.
 *
 * @param {Todoist_Object|undefined} todoist_obj - if already created, otherwise the function will create its own.
 * @param  {string} content the task content as string
 * @return {Boolean} true when added successfully, false when adding task failed
 */
function Draftist_quickAdd({
  todoist = new Todoist(),
  content
}) {
  if (!todoist.quickAdd(content)) {
    let error = Draftist_checkTodoistForError(todoist)
    let errorMsg = "adding tasks failed, todoist returned:\n" + error
    Draftist_failAction("Quick Add", errorMsg)
    return false;
  } else {
    return true;
  }
}

/**
 * Draftist_createTask - creates a Task with the given parameters
 *
 * @param {Todoist_Object|undefined} todoist_obj - if already created, otherwise the function will create its own.
 * @param  {String} content: Task content. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the Text Formatting article in the Todoist Help Center.
 * @param  {String} description?: A description for the task. This value may contain markdown-formatted text and hyperlinks. Details on markdown support can be found in the Text Formatting article in the Todoist Help Center.
 * @param  {Integer} project_id?: Task project ID. If not set, task is put to user's Inbox.
 * @param  {Integer} section_id?: ID of section to put task into.
 * @param  {Integer} parent_id?: Parent task ID.
 * @param  {Integer} order?: Non-zero integer value used by clients to sort tasks under the same parent.
 * @param  {Integer[]} label_ids?: IDs of labels associated with the task.Integer
 * @param  {Ingeger} priority?: Task priority from 1 (normal) to 4 (urgent).
 * @param  {String} due_string?: No	Human defined task due date (ex.: "next Monday", "Tomorrow"). Value is set using local (not UTC) time.
 * @param  {String} due_date?: Specific date in YYYY-MM-DD format relative to user’s timezone.
 * @param  {String} due_datetime?: Specific date and time in RFC3339 format in UTC.
 * @param  {String} due_lang?: 2-letter code specifying language in case due_string is not written in English.
 * @param  {Integer} assignee?: The responsible user ID (if set, and only for shared tasks).
 * @param  {Boolean} getTaskResult?: if set to true, the function will return the api response of the created Task
 * @return {Boolean} true when added successfully, false when adding task failed
 */
function Draftist_createTask({
  todoist = new Todoist(),
  content,
  description = "",
  project_id = undefined,
  section_id = undefined,
  parent_id = undefined,
  order = undefined,
  label_ids = [],
  priority = undefined,
  due_string = undefined,
  due_date = undefined,
  due_datetime = undefined,
  due_lang = undefined,
  assignee = undefined
}, getTaskResult = false) {
  // check if provided content is not empty
  if (content.length == 0) {
    Draftist_failAction("create Task", "no task content provided")
    return false;
  }


  let taskMap = new Map();
  taskMap.set("content", content);
  taskMap.set("description", description);
  if (project_id) {
    taskMap.set("project_id", project_id);
  }
  if (section_id) {
    taskMap.set("section_id", section_id);
  }
  if (parent_id) {
    taskMap.set("parent_id", parent_id);
  }
  if (order) {
    taskMap.set("order", order);
  }
  if (label_ids.length > 0) {
    taskMap.set("label_ids", label_ids);
  }
  if (priority) {
    taskMap.set("priority", priority);
  }
  if (due_string) {
    taskMap.set("due_string", due_string);
  }
  if (due_date) {
    taskMap.set("due_date", due_date);
  }
  if (due_datetime) {
    taskMap.set("due_datetime", due_datetime);
  }
  if (due_lang) {
    taskMap.set("due_lang", due_lang);
  }
  if (assignee) {
    taskMap.set("assignee", assignee);
  }

  let taskObj = Object.fromEntries(taskMap)
  let taskCreateResult = todoist.createTask(taskObj)
  if (taskCreateResult) {
    if (getTaskResult) {
      return taskCreateResult;
    } else {
      return true;
    }
  } else {
    Draftist_failAction("create Task", Draftist_getLastTodoistError(todoist))
    return false;
  }
}


/**
 * Draftist_quickAddLines - This action creates a new task for each line in the currently open Draft
 *
 * @param  {String} text the text which lines should be added as tasks to Todoist
 * @return {Boolean|Number} false when adding faile, task number when adding succeeded
 */
function Draftist_quickAddLines(text) {
  let todoist = new Todoist()
  let lines = text.split("\n");
  let createdTasksCounter = 0;
  // repeat for each line
  for (line of lines) {
    if (line.length !== 0) {
      if (!Draftist_quickAdd({
          todoist: todoist,
          content: line
        })) {
        // if failed directly return, quickadd will display the error
        return false;
      } else {
        createdTasksCounter++;
      }
    }
  }
  return createdTasksCounter;
}



// Create Tasks Actions

/**
 * Draftist_quickAddLinesFromCurrentDraft - use todoist quick add for each line of the current draft
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_quickAddLinesFromCurrentDraft() {
  if (draft.content.length == 0) {
    Draftist_cancelAction("Add Tasks from current Draft", "Draft is blank")
    return false;
  } else {
    let taskNumber = Draftist_quickAddLines(draft.content);
    if (taskNumber) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added " + taskNumber + " tasks :)")
      return true;
    } else {
      return false;
    }
  }
}


/**
 * Draftist_quickAddLinesFromPrompt - use todoist quick add for each line inserted in the prompt
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_quickAddLinesFromPrompt() {
  let p = new Prompt();
  p.title = "add tasks from lines";
  p.addTextView("tasks", "", "", {
    wantsFocus: true
  });
  p.addButton("add tasks");

  if (!p.show()) {
    Draftist_cancelAction("Add Tasks from Prompt", "cancelled by user");
    return false;
  }
  // user did select "add tasks"
  let input = p.fieldValues["tasks"];
  if (input.length == 0) {
    Draftist_cancelAction("Add Tasks from Prompt", "No input provided")
    return false;
  } else {
    let taskNumber = Draftist_quickAddLines(draft.content);
    if (taskNumber) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added " + taskNumber + " tasks :)")
      return true;
    } else {
      return false;
    }
  }
}

/**
 * Draftist_createTaskWithDescription - reate a task with the first line of the input as content and everything else as description
 *
 * @param  {String} text the text which should be used for the task and description
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTaskWithDescription(text) {
  let lines = text.split("\n");
  // first line is the tasks content, remove it from the array and assign it
  let content = lines.shift();
  let description = lines.join("\n")
  return Draftist_createTask({
    content: content,
    description: description
  });
}

/**
 * Draftist_createTaskWithDescriptionFromCurrentDraft - add task with description from current draft. use the first line as content and everything else as description
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTaskWithDescriptionFromCurrentDraft() {
  if (draft.content.length == 0) {
    Draftist_cancelAction("Task with description from current Draft", "Draft is blank")
    return false;
  } else {
    let taskCreated = Draftist_createTaskWithDescription(draft.content);
    if (taskCreated) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added task");
      return true;
    } else {
      return false
    }
  }
}

/**
 * Draftist_createTaskWithDescriptionFromPrompt - add task with description from prompt. use the first line as content and everything else as description
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTaskWithDescriptionFromPrompt() {
  let p = new Prompt();
  p.title = "add tasks with description";
  p.message = "first line is the tasks content; everything else will be used as description"
  p.addTextView("task", "", "", {
    wantsFocus: true
  });
  p.addButton("add task");

  if (!p.show()) {
    Draftist_cancelAction("Add Tasks from Prompt", "cancelled by user");
    return false;
  }
  // user did select "add tasks"
  let input = p.fieldValues["task"];
  if (input.length == 0) {
    Draftist_cancelAction("Add Tasks from Prompt", "No input provided")
    return false;
  } else {
    let taskCreated = Draftist_createTaskWithDescription(input);
    if (taskCreated) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added task");
      return true;
    } else {
      return false
    }
  }
}

// #############################################################################
// CREATE TASK OBJECT
// #############################################################################

/**
 * Draftist_createTaskObjectWithSettingsFromPrompt - creates a todoist task object with settings from prompts
 *
 * @param  {String} content     content of the task (must not be empty)
 * @param  {String} description? description for the task (can be empty)
 * @return {taskObject}             taskObject for a todoist task which can be passed to the Todoist.createTask() API of Drafts
 */
function Draftist_createTaskObjectWithSettingsFromPrompt(content, description = "") {
  // check if any map of the todoist data contains data - if not, load the data into the vars
  if (projectsNameToIdMap.size == 0) {
    Draftist_getStoredTodoistData();
  }

  // due date prompt
  let pDate = new Prompt()
  pDate.title = "select due date for \"" + content + "\":";
  pDate.addButton("today");
  pDate.addButton("tomorrow");
  pDate.addButton("next week");
  pDate.addButton("other");
  pDate.addButton("no due date", undefined)
  pDate.isCancellable = false;
  pDate.show();
  // if buttonPressed is undefined no due date was selected
  const dateIsSet = (pDate.buttonPressed ? true : false);
  let selectedDateString = undefined;
  if (dateIsSet) {
    if (pDate.buttonPressed == "other") {
      var pSelDate = new Prompt();
      pSelDate.title = "select custom date for \"" + content + "\":";
      var today = new Date();
      var tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
      pSelDate.addDatePicker("dueDatePicker", "", tomorrow, {
        "mode": "date",
        "minimumDate": tomorrow
      });

      pSelDate.addButton("set due date");
      pSelDate.isCancellable = false;
      pSelDate.show();
      let pickedDueDate = pSelDate.fieldValues["dueDatePicker"];
      let day = pickedDueDate.getDate();
      let month = pickedDueDate.getMonth() + 1;
      let year = pickedDueDate.getFullYear();
      selectedDateString = String(year) + "-" + String(month) + "-" + String(day);
    } else {
      selectedDateString = pDate.buttonPressed;
    }
  }

  // priority prompt
  let pPrio = new Prompt();
  pPrio.title = "select priority for \"" + content + "\":";
  pPrio.addButton("p1");
  pPrio.addButton("p2");
  pPrio.addButton("p3");
  pPrio.addButton("p4");
  pPrio.isCancellable = false;
  pPrio.show();

  // the api of todoist uses different numbering than the user sees. p1 is reflected as value 4, p2 -> 3 and so on -> store this value
  let selectedPriority = 0;
  switch (pPrio.buttonPressed) {
    case "p1":
      selectedPriority = 4;
      break;
    case "p2":
      selectedPriority = 3;
      break;
    case "p3":
      selectedPriority = 2;
      break;
    case "p4":
      selectedPriority = 1;
      break;
  }


  // project prompt
  let pProject = new Prompt();
  pProject.title = "select project for \"" + content + "\":";
  pProject.message = "select Inbox if you want to sort it later"

  let sortedProjectNameMap = new Map([...projectsNameToIdMap].sort((a, b) => String(a[0]).localeCompare(b[0])))
  for (const [pName, pId] of sortedProjectNameMap) {
    // selected button will directly contain the projects id as value
    pProject.addButton(pName, pId);
  }

  pProject.isCancellable = false;
  pProject.show();
  let selectedProjectId = pProject.buttonPressed;

  // labels prompt
  let pLabels = new Prompt();
  pLabels.title = "select labels for \"" + content + "\":";
  let sortedLabelsNameMap = new Map([...labelsNameToIdMap].sort((a, b) => String(a[0]).localeCompare(b[0])))

  pLabels.addSelect("labels", "select labels", Array.from(sortedLabelsNameMap.keys()), [], true);
  pLabels.addButton("set labels");
  pLabels.isCancellable = false;
  pLabels.show();
  let selectedLabels = pLabels.fieldValues["labels"];
  let selectedlabelIDs = [];
  for (label of selectedLabels) {
    selectedlabelIDs.push(labelsNameToIdMap.get(label));
  }

  let taskObject = {
    content: content,
    description: description,
    project_id: selectedProjectId,
    section_id: undefined,
    label_ids: selectedlabelIDs,
    priority: selectedPriority,
    due_string: (selectedDateString ? selectedDateString : undefined),
  }

  return taskObject;

}

// #############################################################################
// CREATE TASKS WITH SETTINGS
// #############################################################################

/**
 * Draftist_createTaskWithDescriptionAndSettings - create a task with description and settings (project, labels, due date) from prompts. first line will be used as task content, everything else will be the description
 *
 * @param  {String} text the text which should be used for the task and description
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTaskWithDescriptionAndSettings(text) {
  let lines = text.split("\n");
  // first line is the tasks content, remove it from the array and assign it
  let content = lines.shift();
  let description = lines.join("\n")
  return Draftist_createTask(Draftist_createTaskObjectWithSettingsFromPrompt(content, description));
}

/**
 * Draftist_createTaskWithDescriptionAndSettingsFromCurrentDraft - add task with description and settings from prompt from current draft. use the first line as content and everything else as description
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTaskWithDescriptionAndSettingsFromCurrentDraft() {
  if (draft.content.length == 0) {
    Draftist_cancelAction("Task with description from current Draft", "Draft is blank")
    return false;
  } else {
    let taskCreated = Draftist_createTaskWithDescriptionAndSettings(draft.content);
    if (taskCreated) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added task");
      return true;
    } else {
      return false
    }
  }
}

/**
 * Draftist_createTaskWithDescriptionAndSettingsFromPrompt - add task with description and Settings from prompts. use the first line as content and everything else as description
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTaskWithDescriptionAndSettingsFromPrompt() {
  let p = new Prompt();
  p.title = "add task with description & settings";
  p.message = "first line is the tasks content; everything else will be used as description"
  p.addTextView("task", "", "", {
    wantsFocus: true
  });
  p.addButton("add task");

  if (!p.show()) {
    Draftist_cancelAction("Add Tasks from Prompt", "cancelled by user");
    return false;
  }
  // user did select "add tasks"
  let input = p.fieldValues["task"];
  if (input.length == 0) {
    Draftist_cancelAction("Add Tasks from Prompt", "No input provided")
    return false;
  } else {
    let taskCreated = Draftist_createTaskWithDescriptionAndSettings(input);
    if (taskCreated) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added task");
      return true;
    } else {
      return false
    }
  }
}

// #############################################################################
// CREATE LINKED TASKS
// #############################################################################

/**
 * Draftist_helperCreateMdLinkToCurrentDraft - creates a markdown link to the current draft in the editor
 *
 * @return {String}  markdown link to the current open draft in the editor
 */
function Draftist_helperCreateMdLinkToCurrentDraft() {
  return "[" + draft.displayTitle + "]" + "(" + draft.permalink + ")"
}


/**
 * Draftist_helperCreateOpenTaskUrlFromTaskObject - creates the weblink to the given task object
 *
 * @param  {Task} taskObject Todoist Task Object in JSON format
 * @return {String}          web link to the Todoist task
 */
function Draftist_helperCreateOpenTaskUrlFromTaskObject(taskObject) {
  // load settings
  Draftist_loadCurrentConfigurationSettings()
  const webLink = "[Todoist Task Weblink](" + taskObject.url + ")";
  const mobileLink = "[Todoist Task Applink](todoist://task?id=" + taskObject.id + ")";
  if (activeSettings["taskLinkTypes"].includes("web") && activeSettings["taskLinkTypes"].includes("app")) {
    return webLink + "\n" + mobileLink;
  } else if (activeSettings["taskLinkTypes"].includes("web") && !activeSettings["taskLinkTypes"].includes("app")) {
    return webLink;
  } else if (!activeSettings["taskLinkTypes"].includes("web") && activeSettings["taskLinkTypes"].includes("app")) {
    return mobileLink;
  }
}


/**
 * Draftist_createTaskInInboxWithLinkToDraft - creates a task in the Todoist Inbox containing the title and link to the current draft
 *
 * @return {Boolean}  true if succeeded, otherwise false
 */
function Draftist_createTaskInInboxWithLinkToDraft() {
  if (Draftist_createTask({
      content: Draftist_helperCreateMdLinkToCurrentDraft()
    })) {
    Draftist_succeedAction("", false, "added linked task");
    return true;
  } else {
    return false;
  }
}

/**
 * Draftist_createTaskWithSettingsAndLinkToDraft - creates a task in the Todoist with settings from prompts containing the title and link to the current draft
 *
 * @return {Boolean}  true if succeeded, otherwise false
 */
function Draftist_createTaskWithSettingsAndLinkToDraft() {
  let taskObject = Draftist_createTaskObjectWithSettingsFromPrompt(Draftist_helperCreateMdLinkToCurrentDraft());
  if (Draftist_createTask(taskObject)) {
    Draftist_succeedAction("", false, "added linked task with settings");
    return true;
  } else {
    return false;
  }
}


/**
 * Draftist_helperAddTextBetweenTitleAndBodyOfCurrentDraft - adds the provided text between the title and body of the current draft the added text will be surrounded by empty lines
 *
 * @param  {type} textToAdd the text to add between title and body
 */
function Draftist_helperAddTextBetweenTitleAndBodyOfCurrentDraft(textToAdd) {
  let lines = draft.content.split("\n");
  let curIndex = 1
  if (lines[curIndex].length != 0) {
    lines.splice(curIndex, 0, "");
  }
  curIndex++;
  lines.splice(curIndex, 0, textToAdd)
  curIndex++;
  if (lines[curIndex].length != 0) {
    lines.splice(curIndex, 0, "")
  }
  draft.content = lines.join("\n");
  draft.update()
}

/**
 * Draftist_createTaskInInboxWithLinkToDraft - creates a task in the Todoist Inbox containing the title and link to the current draft. A link to the created Task in Todoist will be added to the Draft between the title and the body
 *
 * @return {Boolean}  true if succeeded, otherwise false
 */
function Draftist_createCrosslinkedTaskInInbox() {
  let createdTask = Draftist_createTask({
    content: Draftist_helperCreateMdLinkToCurrentDraft()
  }, true)
  if (createdTask) {
    Draftist_helperAddTextBetweenTitleAndBodyOfCurrentDraft(Draftist_helperCreateOpenTaskUrlFromTaskObject(createdTask));
    Draftist_succeedAction("", false, "added linked task");
    return true;
  } else {
    return false;
  }
}

/**
 * Draftist_createCrosslinkedTaskWithSettings - creates a task in the Todoist with settings from prompts containing the title and link to the current draft. A link to the created Task in Todoist will be added to the Draft between the title and the body
 *
 * @return {Boolean}  true if succeeded, otherwise false
 */
function Draftist_createCrosslinkedTaskWithSettings() {
  let taskObject = Draftist_createTaskObjectWithSettingsFromPrompt(Draftist_helperCreateMdLinkToCurrentDraft());
  let createdTask = Draftist_createTask(taskObject, true)
  if (createdTask) {
    Draftist_helperAddTextBetweenTitleAndBodyOfCurrentDraft(Draftist_helperCreateOpenTaskUrlFromTaskObject(createdTask));
    Draftist_succeedAction("", false, "added linked task");
    return true;
  } else {
    return false;
  }
}

// #############################################################################
// CREATE MULTIPLE TASKS
// #############################################################################

/**
 * Draftist_createTasksFromLinesWithIdenticalSettings - creates a task from each line in the passed text with identical settings from prompts
 *
 * @param  {String} text the string containing the tasks seperated by new lines
 * @return {Boolean}      true if added successfully; false if adding tasks failed
 */
function Draftist_createTasksFromLinesWithIdenticalSettings(text) {
  if (text.length == 0) {
    return false;
  } else {
    let taskCount = 0;
    let taskBaseObject = Draftist_createTaskObjectWithSettingsFromPrompt("multiple tasks");
    let lines = text.split("\n");
    for (line of lines) {
      if (line.length != 0) {
        taskBaseObject.content = line
        if (Draftist_createTask(taskBaseObject)) {
          // increase task counter
          taskCount = taskCount + 1;
        } else {
          // stop adding tasks and return immideately
          return false;
        }
      }
    }
    // succeeded
    Draftist_succeedAction("", false, "successfully added " + taskCount + " task(s)");
  }
}


/**
 * Draftist_createTasksFromLinesInDraftWithIdenticalSettings - creates tasks for each line in the current draft with identical settings from prompts
 *
 * @return {Boolean}  true if added successfully; false if adding tasks failed
 */
function Draftist_createTasksFromLinesInDraftWithIdenticalSettings() {
  if (draft.content.length != 0) {
    return Draftist_createTasksFromLinesWithIdenticalSettings(draft.content);
  } else {
    Draftist_cancelAction("Tasks from lines in current Draft with identical settings", "Draft is blank")
    return false;
  }
}


/**
 * Draftist_createTasksFromLinesInPromptWithIdenticalSettings - creates tasks for each line in the displayed prompt with identical settings from prompts
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTasksFromLinesInPromptWithIdenticalSettings() {
  let p = new Prompt();
  p.title = "add tasks with same settings";
  p.message = "each line will be its own task - all use the same settings in the next prompts"
  p.addTextView("tasks", "", "", {
    wantsFocus: true
  });
  p.addButton("add tasks");

  if (!p.show()) {
    Draftist_cancelAction("Add Tasks from Prompt", "cancelled by user");
    return false;
  }
  // user did select "add tasks"
  let input = p.fieldValues["tasks"];
  if (input.length == 0) {
    Draftist_cancelAction("Add Tasks from Prompt", "No input provided")
    return false;
  } else {
    let taskCreated = Draftist_createTasksFromLinesWithIdenticalSettings(input);
    if (taskCreated) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added task");
      return true;
    } else {
      return false
    }
  }
}


/**
 * Draftist_createTasksFromLinesWithIndividualSettings - creates a task from each line in the passed text with individual settings for each line from prompts
 *
 * @param  {String} text the string containing the tasks seperated by new lines
 * @return {Boolean}      true if added successfully; false if adding tasks failed
 */
function Draftist_createTasksFromLinesWithIndividualSettings(text) {
  if (text.length == 0) {
    return false;
  } else {
    let taskCount = 0;
    let lines = text.split("\n");
    for (line of lines) {
      if (line.length != 0) {
        if (Draftist_createTask(Draftist_createTaskObjectWithSettingsFromPrompt(line))) {
          // increase task counter
          taskCount = taskCount + 1;
        } else {
          // stop adding tasks and return immideately
          return false;
        }
      }
    }
    // succeeded
    Draftist_succeedAction("", false, "successfully added " + taskCount + " task(s)");
  }
}

/**
 * Draftist_createTasksFromLinesInDraftWithIndividualSettings - creates tasks for each line in the current draft with individual settings from prompts
 *
 * @return {Boolean}  true if added successfully; false if adding tasks failed
 */
function Draftist_createTasksFromLinesInDraftWithIndividualSettings() {
  if (draft.content.length != 0) {
    return Draftist_createTasksFromLinesWithIndividualSettings(draft.content);
  } else {
    Draftist_cancelAction("Tasks from lines in current Draft with individual settings", "Draft is blank")
    return false;
  }
}

/**
 * Draftist_createTasksFromLinesInPromptWithIndividualSettings - creates tasks for each line in the displayed prompt with individual settings from prompts
 *
 * @return {Boolean}  true when added successfully, false when adding task failed
 */
function Draftist_createTasksFromLinesInPromptWithIndividualSettings() {
  let p = new Prompt();
  p.title = "add tasks with individual settings";
  p.message = "each line will be its own task - each uses different settings from the next prompts"
  p.addTextView("tasks", "", "", {
    wantsFocus: true
  });
  p.addButton("add tasks");

  if (!p.show()) {
    Draftist_cancelAction("Add Tasks from Prompt", "cancelled by user");
    return false;
  }
  // user did select "add tasks"
  let input = p.fieldValues["tasks"];
  if (input.length == 0) {
    Draftist_cancelAction("Add Tasks from Prompt", "No input provided")
    return false;
  } else {
    let taskCreated = Draftist_createTasksFromLinesWithIndividualSettings(input);
    if (taskCreated) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added task");
      return true;
    } else {
      return false
    }
  }
}


/**
 * Draftist_helperGetMdTasksFromCurrentDraft - searches the current draft for markdown tasks "- [ ]" and retruns an array with the "content" of the tasks
 *
 * @return {String[]}  array of task contents
 */
function Draftist_helperGetMdTasksFromCurrentDraft() {
  let content = draft.content;
  // find all lines with a task marker at the beginning which are uncompleted
  const regex = /^- \[\s\]\s(.*)$/gm;
  const subst = `$1`;
  let matches = [...content.matchAll(regex)]
  // the first group of each match is the task content (without the md task marker)
  let taskContents = matches.map(match => match[1])
  return taskContents
}


/**
 * Draftist_quickAddTasksFromMdTodoLinesInDraft - creates tasks for each md task in the current open draft. This function uses the Todoist quickAdd API which allows adding due dates, labels, projects with the syntax also used in the Todoist task input.
 *
 * @return {Boolean}  true if added successfully (or no task was found), false if adding task failed
 */
function Draftist_quickAddTasksFromMdTodoLinesInDraft() {
  let tasks = Draftist_helperGetMdTasksFromCurrentDraft()
  if (tasks.length > 0) {
    // combine task contents by new lines to work with the quickAddLines function
    let taskNumber = Draftist_quickAddLines(tasks.join("\n"));
    if (taskNumber) {
      // succeeded
      Draftist_succeedAction("", false, "successfully added " + taskNumber + " tasks :)")
      return true;
    } else {
      return false;
    }
  } else {
    Draftist_infoMessage("", "no (uncompleted) tasks found in draft");
    return true;
  }
}


/**
 * Draftist_createTasksWithIdenticalSettingsFromMdTasksInCurrentDraft - creates tasks with same settings for every md task in the current document. The settings can be selected in the displayed prompts.
 *
 * @return {Boolean}  true if added successfully (or no task was found), false if adding task failed
 */
function Draftist_createTasksWithIdenticalSettingsFromMdTasksInCurrentDraft() {
  let tasks = Draftist_helperGetMdTasksFromCurrentDraft()
  if (tasks.length > 0) {
    // combine task contents by new lines to input a text which is split in the called function
    return Draftist_createTasksFromLinesWithIdenticalSettings(tasks.join("\n"));
  } else {
    Draftist_infoMessage("", "no (uncompleted) tasks found in draft");
    return true;
  }
}

/**
 * Draftist_createTasksWithIndividualSettingsFromMdTasksInCurrentDraft - creates tasks with individual settings for every md task in the current document. The settings can be selected in the displayed prompts.
 *
 * @return {Boolean}  true if added successfully (or no task was found), false if adding task failed
 */
function Draftist_createTasksWithIndividualSettingsFromMdTasksInCurrentDraft() {
  let tasks = Draftist_helperGetMdTasksFromCurrentDraft()
  if (tasks.length > 0) {
    // combine task contents by new lines to input a text which is split in the called function
    return Draftist_createTasksFromLinesWithIndividualSettings(tasks.join("\n"));
  } else {
    Draftist_infoMessage("", "no (uncompleted) tasks found in draft");
    return true;
  }
}

// #############################################################################
// IMPORT TASKS
// #############################################################################

/**
 * Draftist_createStringFromTasks - converts the passed tasks to strings with contents using the active settings for task strings
 *
 * @param {Tasks[]}   tasks - Todoist task objects to convert to strings
 * @return {String}   string containing the task informations
 */
function Draftist_createStringFromTasks({
  tasks
}) {
  Draftist_loadCurrentConfigurationSettings();
  const contentSettings = activeSettings["taskImportContents"];
  let tasksString = ""
  for (task of tasks) {
    // task content
    tasksString = tasksString + "- [ ] " + task.content
    // app link
    if (contentSettings.includes("appLink")) {
      tasksString = tasksString + " [app link](todoist://task?id=" + task.id + ")";
    }
    // web link
    if (contentSettings.includes("webLink")) {
      tasksString = tasksString + " [web link](" + task.url + ")";
    }

    if (contentSettings.includes("projectName")) {
      if (projectsIdToNameMap.size == 0) {
        Draftist_getStoredTodoistData();
      }
      tasksString = tasksString + " *" + projectsIdToNameMap.get(task.project_id) + "*"
    }

    if (contentSettings.includes("priority")) {
      tasksString = tasksString + " p" + (5 - task.priority);
    }

    if (contentSettings.includes("labels")) {
      if (labelsIdToNameMap.size == 0) {
        Draftist_getStoredTodoistData();
      }
      for (labelId of task.label_ids) {
        tasksString = tasksString + " @" + labelsIdToNameMap.get(labelId);
      }
    }
    tasksString = tasksString + "\n"
  }
  return tasksString;
}


/**
 * Draftist_getTodoistTasksFromFilter - returns the tasks in todoist for a given filter string
 *
 * @param  {String} filterString a valid todoist filter string
 * @return {Task[]}              array of Task objects (JSON) for the given filter string
 */
function Draftist_getTodoistTasksFromFilter(filterString) {
  let todoist = new Todoist()
  let tasks = todoist.getTasks({
    filter: filterString
  })
  const occuredError = Draftist_getLastTodoistError(todoist)
  if (occuredError) {
    //error occured
    Draftist_failAction("get tasks from filter \"" + filterString + "\"", occuredError)
    return false;
  }
  return tasks;
}


/**
 * Draftist_importTodaysTasksIntoDraft - appends the tasks due today (or overdue) to the current draft
 *
 */
function Draftist_importTodaysTasksIntoDraft() {
  const tasks = Draftist_getTodoistTasksFromFilter("overdue, today");
  const stringToInsert = Draftist_createStringFromTasks({
    tasks: tasks
  })
  draft.content = draft.content + "\n **TODAYs TASKs:**\n\n" + stringToInsert;
  draft.update()
}


/**
 * Draftist_importTasksFromProjectName - imports the tasks from the provided project name into the current draft
 *
 * @param  {String} projectName the project name for the tasks to import
 */
function Draftist_importTasksFromProjectName(projectName) {
  if (projectsNameToIdMap.size == 0) {
    Draftist_getStoredTodoistData();
  }
  const projectNames = Array.from(projectsNameToIdMap.keys());
  // check if project name is available, if not fail the action
  if (!projectNames.includes(projectName)) {
    Draftist_failAction("import tasks from project", "project with name \"" + projectName + "\" is not existing in your Todoist Account")
    return
  }
  const tasks = Draftist_getTodoistTasksFromFilter("##" + projectName)
  const stringToInsert = Draftist_createStringFromTasks({
    tasks: tasks
  })
  draft.content = draft.content + "\n **TASKs from " + projectName + ":**\n\n" + stringToInsert;
  draft.update()
}


/**
 * Draftist_importTasksFromSelectedProject - presents a prompt to let the user select a project and then imports the task of the selected project into the current draft
 *
 */
function Draftist_importTasksFromSelectedProject() {
  if (projectsNameToIdMap.size == 0) {
    Draftist_getStoredTodoistData();
  }
  let pProject = new Prompt();
  pProject.title = "select the project"
  let sortedProjectNameMap = new Map([...projectsNameToIdMap].sort((a, b) => String(a[0]).localeCompare(b[0])))
  for (const [pName, pId] of sortedProjectNameMap) {
    // selected button will directly contain the projects id as value
    pProject.addButton(pName);
  }
  if (pProject.show()) {
    Draftist_importTasksFromProjectName(pProject.buttonPressed);
  } else {
    Draftist_cancelAction("import tasks from project", "user cancelled")
  }

}

/**
 * Draftist_importTasksWithLabels - imports the tasks with the provided label names into the current draft. Depending on the input parameter either all or any given labels must be included in a task.
 *
 * @param  {String} labelNames the label names for the tasks to import (separated by a comma)
 * @param  {Boolean} requireAllLabels if set to true all given labels must be present in the task to be imported, if set to false only one of the given labels must be present in the task
 */

function Draftist_importTasksWithLabels(labelNames, requireAllLabels) {
  const requestedLabels = labelNames.split(",");
  if (labelsNameToIdMap.size == 0) {
    Draftist_getStoredTodoistData();
  }
  const validLabelNames = Array.from(labelsNameToIdMap.keys());
  let labelStrings = [];
  for (labelName of requestedLabels) {
    // check if all given label names are available, if not fail the action
    if (!validLabelNames.includes(labelName)) {
      Draftist_failAction("import tasks with label", "label with name \"" + labelName + "\" is not existing in your Todoist Account")
      return
    }
    labelStrings.push("@" + labelName);
  }
  const filterString = labelStrings.join((requireAllLabels ? " & " : " | "))
  const tasks = Draftist_getTodoistTasksFromFilter(filterString)
  const stringToInsert = Draftist_createStringFromTasks({
    tasks: tasks
  })
  draft.content = draft.content + "\n **TASKs with label(s) " + filterString + ":**\n\n" + stringToInsert;
  draft.update()
}


/**
 * Draftist_importTasksWithSelectedLabels - imports the tasks from the selected labels in a prompt into the current draft. Depending on the input parameter either all or any given labels must be included in a task.
 *
 * @param  {type} requireAllLabels if set to true all given labels must be present in the task to be imported, if set to false only one of the given labels must be present in the task
 */
function Draftist_importTasksWithSelectedLabels(requireAllLabels) {
  if (labelsNameToIdMap.size == 0) {
    Draftist_getStoredTodoistData();
  }
  let pLabels = new Prompt();
  pLabels.title = "select the labels"
  pLabels.message = (requireAllLabels ? "all selected labels " : "any selected label") + " must be present in the task"
  let sortedLabelNameMap = new Map([...labelsNameToIdMap].sort((a, b) => String(a[0]).localeCompare(b[0])))
  pLabels.addSelect("selectedLabels", "", Array.from(sortedLabelNameMap.keys()), [], true)
  pLabels.addButton("Apply")
  if (pLabels.show()) {
    Draftist_importTasksWithLabels(pLabels.fieldValues["selectedLabels"].join(","), requireAllLabels);
  } else {
    Draftist_cancelAction("import tasks from project", "user cancelled")
  }
}


/**
 * Draftist_importTasksFromFilter - imports the tasks for the given filter string into the current draft
 *
 * @param  {type} filterString filter string for Todoist tasks
 */
function Draftist_importTasksFromFilter(filterString) {
  const tasks = Draftist_getTodoistTasksFromFilter(filterString);
  if (tasks) {
    const stringToInsert = Draftist_createStringFromTasks({
      tasks: tasks
    })
    draft.content = draft.content + "\n **TASKs from filter \"" + filterString + "\":**\n\n" + stringToInsert;
    draft.update()
  }
}


/**
 * Draftist_importTasksFromFilterInPrompt - imports the tasks from the filter typed into the text field in the prompt
 *
 */
function Draftist_importTasksFromFilterInPrompt() {
  let pFilter = new Prompt()
  pFilter.title = "set the filter query";
  pFilter.message = "you can use any supported filter query by Todoist"
  pFilter.addTextField("filterString", "", "", {
    wantsFocus: true
  });
  pFilter.addButton("Apply");
  if (pFilter.show()) {
    Draftist_importTasksFromFilter(pFilter.fieldValues["filterString"]);
  } else {
    Draftist_cancelAction("import tasks from filter", "user cancelled")
  }
}

// #############################################################################
// MODIFY TASKS
// #############################################################################


function Draftist_updateTask({todoist = new Todoist(),taskToUpdate,labelNamesToRemove = [],labelNamesToAdd = [],newDueDate = undefined, newDueDateTime = undefined}){
  const taskId = taskToUpdate.id;
  
  // update labels
  const currentLabels = taskToUpdate.label_ids;
  // add all labelsToAdd to the array
  let labelIdsToRemove = [];
  let labelIdsToAdd = [];
  // load todoist data if not already loaded
  if(labelsNameToIdMap.size == 0){
    Draftist_getStoredTodoistData();
  }
  
  for(labelName of labelNamesToRemove){
    labelIdsToRemove.push(labelsNameToIdMap.get(labelName));
  }
  
  for(labelName of labelNamesToAdd){
    labelIdsToAdd.push(labelsNameToIdMap.get(labelName));
  }
  
  let updatedLabelIds = labelIdsToAdd;
  
  for(curLabel of currentLabels){
    // add the label to the updated array if its not already included and it is not contained in the labelsToRemove Array
    if(!labelIdsToRemove.includes(curLabel) && !updatedLabelIds.includes(curLabel)){
      updatedLabelIds.push(curLabel);
    }
  }
  
  // update due date / date time
  
  // if date and datetime are provided, return false since this is not possible
  if(newDueDate && newDueDateTime){
    Draftist_failAction("update task", "due date and due date time where provided, this is not allowed")
    return false
  }
  
  let dueDate = taskToUpdate.due_date;
  if(newDueDate){
    // new due date was provided
    dueDate = newDueDate
  }
  
  let dueDateTime = taskToUpdate.due_datetime;
  if(newDueDateTime){
    // new due date time was provided
    dueDateTime = newDueDateTime
  }
  
  // create task options
  let options = {
    "content": taskToUpdate.content,
    "description": taskToUpdate.description,
    "project_id": taskToUpdate.project_id,
    "section_id": taskToUpdate.section_id,
    "parent_id": taskToUpdate.parent_id,
    "order": taskToUpdate.order,
    "label_ids": updatedLabelIds,
    "priority": taskToUpdate.priority,
    "due_date": dueDate,
    "due_datetime": dueDateTime,
    "assignee": taskToUpdate.assignee
  };

  const updateTaskResult = todoist.updateTask(taskId,options);
  if(!updateTaskResult){
    const lastError = Draftist_getLastTodoistError(todoist);
    if(lastError){
      Draftist_failAction("update task", "todoist returned error: " + lastError)
    } else {
      Draftist_failAction("update task", "unknown error occured. please try again and contact @FlohGro with steps to reproduce")
    }
    return false;
  } else {
    return true;
  }
  
}

function Draftist_updateLabelsOfTask({todoist = new Todoist(),taskToUpdate,labelNamesToRemove,labelNamesToAdd}){
  return Draftist_updateTask({todoist:todoist,taskToUpdate:taskToUpdate,labelNamesToRemove:labelNamesToRemove,labelNamesToAdd:labelNamesToAdd})
}

function Draftist_selectTasksFromTaskObjects(taskObjects, allowSelectMultiple, promptMessage){
  let selectedTasks = [];
  let pTasks = new Prompt();
  pTasks.title = "select tasks";
  pTasks.message = promptMessage;
  pTasks.addSelect("selectedTasks","",taskObjects.map(task => task.content),[],allowSelectMultiple)
  pTasks.addButton("select")
  if(pTasks.show()){
    const selectedTaskContents = pTasks.fieldValues["selectedTasks"];
    // iterate through the selected task contents
    for(taskContent of selectedTaskContents){
      // add the task Object with the selected content to the array
      selectedTasks = selectedTasks.concat(taskObjects.filter(task => (task.content == taskContent)))
    }
  } else {
    Draftist_cancelAction("","user cancelled selection")
  }
  return selectedTasks;
}

function Draftist_updateTaskTester(){
  let tasksToUpdate = Draftist_selectTasksFromTaskObjects(Draftist_getTodoistTasksFromFilter("@testlabel"),true,"");
  for(taskToUpdate of tasksToUpdate){
    Draftist_updateTask({taskToUpdate:taskToUpdate, labelNamesToRemove:[],labelNamesToAdd:["thisWEEK","ASAP","idea💡"]
    })
  }
  
  
  
}



// #############################################################################
// SETTINGS AND DATA STORAGE
// #############################################################################

/**
 * settingParamTypes: this defines the types of the settings parameters in text format
 */
const settingsParamTypes = {
  "settingsDraftTags": "textArray",
  "dataStoreDraftTags": "textArray",
  "dataStoreUpdateInterval": "number",
  "taskLinkTypes": "textArray",
  "taskImportContents": "textArray"
}


/**
 * defaultSettingsParams: these are the default settings for the Action Group
 */
const defaultSettingsParams = {
  "settingsDraftTags": [
    "_draftistSettings",
    "/ref-script"
  ],
  "dataStoreDraftTags": [
    "_draftistSettings",
    "/ref-script"
  ],
  "dataStoreUpdateInterval": 24,
  "taskLinkTypes": ["app", "web"],
  "taskImportContents": ["appLink", "webLink", "projectName", "priority", "labels"]
}


/**
 * static definition of the names for the storage Drafts
 */
const settingsDraftName = "Draftist Action Group Settings";
const dataStoreDraftName = "Draftist Todoist Data Store";

/**
 * global variables that are used within the various functions to access current settings - stored in variables to quicker access them in different use cases
 */
let activeSettings = undefined;
let lastUpdated = undefined;
let projects = undefined;
let labels = undefined;
let sections = undefined;
let projectsNameToIdMap = new Map();
let projectsIdToNameMap = new Map();
let labelsNameToIdMap = new Map();
let labelsIdToNameMap = new Map();


/**
 * Draftist_findOrCreateSettingsDraft - loads the configuration settings from the settings Draft - if it is not existing it will be created with the default settings
 *
 * @return {Draft|Boolean}  returns the Draft Object if a settings Draft was found; if an error occured it returns false
 */
function Draftist_findOrCreateSettingsDraft() {
  const draftName = settingsDraftName;
  let notificationMessage = ""
  let resultDrafts = [];
  let dResults = Draft.queryByTitle(draftName);
  if (dResults.length > 0) {
    // filter out drafts with more in the title than just the "draftName"
    for (res of dResults) {
      if (res.displayTitle == "// " + draftName) {
        resultDrafts.push(res)
      }
    }
  } else {
    let settingsDraft = Draftist_createStorageDraft(draftName)
    Draftist_initConfigurationSettingsDraft(settingsDraft)
    resultDrafts.push(settingsDraft);
  }
  if (resultDrafts.length > 1) {
    Draftist_failAction("Draftist_findOrCreateSettingsDraft", "more than one setting Drafts found")
    return false;
  } else {
    // one settings Draft was found (or just created), read the settings from it into the active settings variable
    Draftist_readConfigurationSettingsFromDraft(resultDrafts[0]);
    return resultDrafts[0]
  }
}


/**
 * Draftist_findOrCreateDataStoreDraft - loads the stored todoist data from the data store Draft - if it is not existing it will be created and the data will be retrieved from Todoist
 *
 * @return {Draft|Boolean}  returns the Draft Object if the data store Draft was found; if an error occured it returns false
 */
function Draftist_findOrCreateDataStoreDraft() {
  const draftName = dataStoreDraftName;
  let notificationMessage = ""
  let resultDrafts = [];
  let dResults = Draft.queryByTitle(draftName);
  if (dResults.length > 0) {
    // filter out drafts with more in the title than just the "draftName"
    for (res of dResults) {
      if (res.displayTitle == "// " + draftName) {
        resultDrafts.push(res)
      }
    }
  } else {
    let storeDraft = Draftist_createStorageDraft(draftName)
    Draftist_initDataStoreDraft(storeDraft)
    resultDrafts.push(storeDraft);
  }

  if (resultDrafts.length > 1) {
    // TODO: DRAFTIST FAIL ACTION!
    return false;
  } else {
    // one settings Draft was found (or just created), read the settings from it into the active settings variable
    return resultDrafts[0];
  }
}


/**
 * Draftist_createStorageDraft - creates a Draft to store settings or todoist data - this function is used internally
 *
 * @param  {String} draftName title to use for the Draft
 * @return {Draft}           Draft object of the storage Draft
 */
function Draftist_createStorageDraft(draftName) {
  let storeDraft = new Draft();
  storeDraft.syntax = Syntax.find("builtIn", "JavaScript")
  storeDraft.content = "// " + draftName + "\n// DON'T MAKE ANY CHANGES TO THIS DRAFT! IT IS USED BY THE DRAFTIST ACTION GROUP\n";
  storeDraft.isArchived = true;
  storeDraft.update();
  return storeDraft;
}


/**
 * Draftist_initConfigurationSettingsDraft - function to initialize the Settings Draft with the default settings (or reset it)
 *
 * @param  {Draft} settingsDraft the Draft object of the settings Draft
 */
function Draftist_initConfigurationSettingsDraft(settingsDraft) {
  // remove all current tags (useful in case settings are restored to defaults)
  for (tag of settingsDraft.tags) {
    settingsDraft.removeTag(tag);
  }
  // set tags according to confiuration
  for (tag of defaultSettingsParams["settingsDraftTags"]) {
    settingsDraft.addTag(tag);
  }
  settingsDraft.content = settingsDraft.content + JSON.stringify(defaultSettingsParams)
  // workaround was not updated as expected.
  settingsDraft.update();
  settingsDraft.update();

}


/**
 * Draftist_initDataStoreDraft - function to initialize the data store Draft with the Todoist Data - initially loads all data from todoist into the storage Draft
 *
 * @param  {Draft} storeDraft the Draft object of the storage Draft
 */
function Draftist_initDataStoreDraft(storeDraft) {
  // set tags according to confiuration
  for (tag of defaultSettingsParams["dataStoreDraftTags"]) {
    storeDraft.addTag(tag);
  }
  // initially load all data from todoist into the Draft
  Draftist_updateStoredTodoistData(new Todoist(), storeDraft);
  // workaround was not updated as expected.
  storeDraft.update();
  storeDraft.update();

}


/**
 * Draftist_readConfigurationSettingsFromDraft - function to read the stored settings into the active settings variable - this function is used internally
 *
 * @param  {Draft} settingsDraft Draft object of the settings Draft
 */
function Draftist_readConfigurationSettingsFromDraft(settingsDraft) {
  activeSettings = Draftist_helperGetObjectFromStoredDraft(settingsDraft)
}


/**
 * Draftist_loadCurrentConfigurationSettings - loads the current settings stored in the settings Draft into the live variable of Draftist
 */
function Draftist_loadCurrentConfigurationSettings() {
  let settingsDraft = Draftist_findOrCreateSettingsDraft()
  Draftist_readConfigurationSettingsFromDraft(settingsDraft);

}


/**
 * Draftist_storeCurrentConfigurationSettings - stores the current active settings in the settings Draft
 *
 * @param  {Draft} settingsDraft Draft object of the settings Draft
 */
function Draftist_storeCurrentConfigurationSettings(settingsDraft) {
  Draftist_helperUpdateObjectInStoreDraft(settingsDraft, activeSettings)
}



/**
 * Draftist_restoreDefaultSettings - funtion to restore the default settings
 *
 */
function Draftist_restoreDefaultSettings() {
  // get the current settingsDraft
  let settingsDraft = Draftist_findOrCreateSettingsDraft();
  // delete it
  settingsDraft.isTrashed = true;
  settingsDraft.update();
  // and create a new one (which will be initialized with the default settings)
  if (Draftist_findOrCreateSettingsDraft()) {
    Draftist_infoMessage("", "restored default settings")
  } else {
    Draftist_failAction("Restore Default Settings", "unexpected failure - this should not happen. please reach out to @FlohGro with a description what you did to fix this.\nDelete all \"Draftist\" drafts and try again")
  }

}


/**
 * Draftist_Settings - open the settings for Draftist - the user can either restore the default settings or change the current active settings
 */
function Draftist_Settings() {
  // load current settings
  Draftist_loadCurrentConfigurationSettings();

  // ask the user if the default settings shall be restored or changes to the settings shall be made.

  let pOptions = new Prompt();
  pOptions.title = "Draftist Settings"
  pOptions.addButton("restore default settings");
  pOptions.addButton("change current settings");
  if (pOptions.show()) {
    // user selected an option
    // execute the corresponding functions based on the selection
    switch (pOptions.buttonPressed) {
      case "restore default settings":
        Draftist_restoreDefaultSettings();
        break;
      case "change current settings":
        Draftist_changeConfigurationSettings();
        break;
    }
  }
}

/**
 * Draftist_changeConfigurationSettings - function to change the current active settings of Draftist and store them in the settings Draft
 *
 * @param  {Draft} settingsDraft Draft object of the settings Draft
 */
function Draftist_changeConfigurationSettings() {
  let settingsDraft = Draftist_findOrCreateSettingsDraft();
  // tags for configurationDraft
  const currentSettingsTags = activeSettings["settingsDraftTags"]
  let pSettingsDraftTags = new Prompt();
  pSettingsDraftTags.title = "set tags for config Draft"
  pSettingsDraftTags.message = "You can use as many tags as you like, seperate each tag by a comma without spaces between the tags.\nThe configuration Draft will only contain the tags in this textfield afterwards"
  pSettingsDraftTags.addTextView("newTags", "", currentSettingsTags.join(","), {
    wantsFocus: true
  })
  pSettingsDraftTags.addButton("apply tags");
  if (pSettingsDraftTags.show()) {
    // user selected to apply new tags
    let newTags = pSettingsDraftTags.fieldValues["newTags"].split(",");
    // now first remove all current tags
    for (tag of currentSettingsTags) {
      settingsDraft.removeTag(tag);
    }
    // now add all new tags
    for (tag of newTags) {
      settingsDraft.addTag(tag);
    }
    settingsDraft.update();
    activeSettings["settingsDraftTags"] = newTags;
  }

  const currentStoreDraftTags = activeSettings["dataStoreDraftTags"]
  let pStoreDraftTags = new Prompt();
  pStoreDraftTags.title = "set tags for Data Store Draft"
  pStoreDraftTags.message = "You can use as many tags as you like, seperate each tag by a comma without spaces between the tags.\nThe configuration Draft will only contain the tags in this textfield afterwards"
  pStoreDraftTags.addTextView("newTags", "", currentStoreDraftTags.join(","), {
    wantsFocus: true
  })
  pStoreDraftTags.addButton("apply tags");
  if (pStoreDraftTags.show()) {
    // find Data Store Draft
    let storeDraft = Draftist_findOrCreateDataStoreDraft();
    // user selected to apply new tags
    let newTags = pStoreDraftTags.fieldValues["newTags"].split(",");
    // now first remove all current tags
    for (tag of currentStoreDraftTags) {
      storeDraft.removeTag(tag);
    }
    // now add all new tags
    for (tag of newTags) {
      storeDraft.addTag(tag);
    }
    storeDraft.update();
    activeSettings["dataStoreDraftTags"] = newTags;
  }

  // setting for local storage usage
  let pStore = new Prompt();
  pStore.title = "update inteval for todoist data"
  pStore.message = "the action group stores todoist data locally in a Draft, this includes e.g. project/label names, ids which are necessary to quickly add tasks to projects (or add labels to tasks), the local storage speeds up creating tasks a lot. The data will be updated in the time period of your choice (in hours default: every 24h)";
  pStore.addSelect("updateInterval", "update interval [h]", ["1", "2", "5", "10", "24", "36", "48"], [activeSettings["dataStoreUpdateInterval"].toString()], false)
  pStore.addButton("Apply");
  if (pStore.show()) {
    // user selected to apply the settings
    // store the setting in current active settings variable
    activeSettings["dataStoreUpdateInterval"] = parseInt(pStore.fieldValues["updateInterval"])
  }

  // settings for crosslinked Task Urls
  let pTaskLinks = new Prompt();
  pTaskLinks.title = "task link settings"
  pTaskLinks.message = "the crosslink task actions can append / prepend links to the created tasks in Todoist to the current draft. App links only work reliably on iOS / iPadOS - If you want to use task links on macOS, too you need to enable web links"
  pTaskLinks.addSelect("linkTypes", "link types", ["app", "web"], activeSettings["taskLinkTypes"], true)
  pTaskLinks.addButton("Apply");
  if (pTaskLinks.show()) {
    activeSettings["taskLinkTypes"] = pTaskLinks.fieldValues["linkTypes"]
  }

  // settings for import task contents
  let pImportContents = new Prompt();
  pImportContents.title = "task import content settings"
  pImportContents.message = "each imported tasks will contain the information you select in this prompt"
  pImportContents.addSelect("taskImportContents", "task import contents", ["appLink", "webLink", "projectName", "priority", "labels"], activeSettings["taskImportContents"], true)
  pImportContents.addButton("Apply");
  if (pImportContents.show()) {
    activeSettings["taskImportContents"] = pImportContents.fieldValues["taskImportContents"]
  }

  // after all settings are reconfigured, store the new settings in the file
  Draftist_storeCurrentConfigurationSettings(settingsDraft);
}


/**
 * Draftist_updateTodoistDataIfUpdateIntervalExceeded - checks if an update of the locally stored Todoist data is needed based on the settings of the dataStoreUpdateInterval
 */
function Draftist_updateTodoistDataIfUpdateIntervalExceeded() {
  // check if variable is defined (was initialized) otherwise load settings from draft
  if (!lastUpdated) {
    Draftist_getStoredTodoistData()
  }
  const now = Date.now();
  let tDiffLastUpdate = now - lastUpdated
  // check if variable is defined (was initialized) otherwise load settings from draft
  if (!activeSettings) {
    Draftist_loadCurrentConfigurationSettings()
  }
  let updateInterval = activeSettings["dataStoreUpdateInterval"] * 3600000;

  if (tDiffLastUpdate > updateInterval) {
    // update is necessary
    Draftist_updateStoredTodoistData();
    //Draftist_getStoredTodoistData();
  }
}


/**
 * Draftist_updateStoredTodoistData - updates the locally stored todoist data in the data store Draft
 *
 * @param  {Todoist} todoist                (optional) the todoist object to use
 * @param  {Draft} storeDraft             (optional) Draft object of the data store Draft
 */
function Draftist_updateStoredTodoistData(todoist = new Todoist(), storeDraft = Draftist_findOrCreateDataStoreDraft()) {
  // retrieve data from todoist
  const projects = todoist.getProjects();
  const sections = todoist.getSections();
  const labels = todoist.getLabels();
  const updatedTimeUnixMilliseconds = Date.now();

  // create object with all todoist data
  const todoistDataToStore = {
    "lastUpdated": updatedTimeUnixMilliseconds,
    "projects": projects,
    "sections": sections,
    "labels": labels
  }
  // get data store Draft
  Draftist_helperUpdateObjectInStoreDraft(storeDraft, todoistDataToStore);
  Draftist_infoMessage("", "updated local Todoist data");
}



/**
 * Draftist_helperGetObjectFromStoredDraft - helper function to get the stored object in the passed draft - this function is used internally
 *
 * @param  {Draft} draftToUse Draft object to read the stored object from
 * @return {Object}            the stored object
 */
function Draftist_helperGetObjectFromStoredDraft(draftToUse) {

  let commentLinesArr = [];
  let jsonLinesArr = [];
  for (line of draftToUse.content.split("\n")) {
    if (line.startsWith("// ")) {
      commentLinesArr.push(line);
    } else {
      jsonLinesArr.push(line)
    }
  }
  return JSON.parse(jsonLinesArr.join("\n"))

}


/**
 * Draftist_helperUpdateObjectInStoreDraft - helper function to store the passed object in the passed Draft - this function is used internally
 *
 * @param  {Draft} draftToUse    Draft object where to store the passed objectToStore
 * @param  {Object} objectToStore the Object to store in the Draft
 */
function Draftist_helperUpdateObjectInStoreDraft(draftToUse, objectToStore) {
  // store lines with comments at the beginning
  let commentLinesArr = [];
  for (line of draftToUse.content.split("\n")) {
    if (line.startsWith("// ")) {
      commentLinesArr.push(line);
    }
  }
  // join the lines again and parse the json string into the settings variable
  let comments = commentLinesArr.join("\n");
  let jsonData = JSON.stringify(objectToStore);
  draftToUse.content = comments + "\n" + jsonData;
  draftToUse.update()
}


/**
 * Draftist_getStoredTodoistData - function to retrieve the stored Todoist Data from the data store Draft - the stored data will be updated if the dataStoreUpdateInterval was exceeded and the stored data will be loaded into the global variables to be accessible for all other functions
 */
function Draftist_getStoredTodoistData() {

  const storeDraft = Draftist_findOrCreateDataStoreDraft();
  const storedData = Draftist_helperGetObjectFromStoredDraft(storeDraft);

  lastUpdated = parseInt(storedData["lastUpdated"]);
  //projects = storedData["projects"]
  projects = storedData["projects"].map((project) => {
    return [project["name"], project["id"]];
  })
  labels = storedData["labels"].map((label) => {
    return [label["name"], label["id"]];
  })
  sections = storedData["sections"].map((section) => {
    return [section["name"], section["id"]];
  })
  for (p of projects) {
    projectsNameToIdMap.set(p[0], p[1])
    projectsIdToNameMap.set(p[1], p[0])
  }
  for (l of labels) {
    labelsNameToIdMap.set(l[0], l[1])
    labelsIdToNameMap.set(l[1], l[0])
  }

  // update data from Todoist if necessary
  Draftist_updateTodoistDataIfUpdateIntervalExceeded();
}


/**
 * Draftist_helperDraftistActionReplicator - opens the installURL for the selected Action of the Draftist Action Group to easily duplicate an Action of Draftist into another ActionGroup. The user has to manually rename the created Action afterwards.
 *
 * @return {undefined}  always returns undefined
 */
function Draftist_helperDraftistActionReplicator() {
  const actionGroup = ActionGroup.find("Draftist");
  if (!actionGroup) {
    // ActionGroup not found
    Draftist_failAction("replicate Action", "Draftist Action Group name was changed")
    return undefined
  }
  let pAction = new Prompt();
  pAction.title = "select action to replicate";
  for (action of actionGroup.actions) {
    if (action.isSeparator) {
      // nothing to be done
    } else {
      pAction.addButton(action.name, action)
    }
  }
  if (!pAction.show()) {
    Draftist_cancelAction("replicate Draftist Action", "user cancelled")
    return undefined
  }
  const actionToReplicate = pAction.buttonPressed;
  app.openURL(actionToReplicate.installURL)
  return undefined
}
