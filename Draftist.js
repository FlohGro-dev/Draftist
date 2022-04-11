/**
 * Draftist ActionGroup Functions
 * @author FlohGro
 * @copyright 2022, FlohGro
 * @licensing free to use - but donate coffees to support development http://www.flohgro.com/donate
 * @version 0.1
 */

/**
 * Draftist_checkTodoistForError - This function checks the provided Todoist Object for errors.
 * If an error was detected it will be returned, otherwise undefined will be returned.
 * @param {Todoist_Object} todoist_obj the todoist object to check
 * @returns {error | undefined} a present error or undefined
 */
function Draftist_getLastTodoistError(todoistObj) {
  let error = todoist_obj.lastError
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
 * @param  {type} displayActionName bool if the provided name of the action shall be displayed or not
 * @param  {type} successMessage    the content for the success message
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
  app.displayInfoMessage(actionName + " was cancelled: " + cancelReasonDescription);
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
 * Draftist_quickAdd - This function adds the provided string to Todoist using the quickAdd API.
 * This supports the Todoist natural language which will be processed by Todoist automatically.
 *
 * @param {Todoist_Object|undefined} todoist_obj - if already created, otherwise the function will create its own.
 * @param  {string} str_TaskContent the task content as string
 * @return {Boolean} true when added successfully, false when adding task failed
 */
function Draftist_quickAdd({
  todoist = Todoist.create(),
  content
}) {
  if (!todoist.quickAdd(str_TaskContent)) {
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
 * @return {Boolean} true when added successfully, false when adding task failed
 */
function Draftist_createTask({
  todoist = Todoist.create(),
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
}) {
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
    return true;
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
  let todoist = Todoist.create()
  let lines = text.split("\n");
  let createdTasksCounter = 0;
  // repeat for each line
  for (line of lines) {
    if (line.length !== 0) {
      if (!Draftist_quickAdd(todoist, line)) {
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

function Draftist_createTaskObjectWithSettingsFromPrompt(content, description) {
  // check if any map of the todoist data contains data - if not, load the data into the vars
  if(projectsNameToIdMap.size == 0){
    Draftist_getStoredTodoistData();
  }

  // due date prompt
  let pDate = new Prompt()
  pDate.title = "select due date:";
  pDate.addButton("today");
  pDate.addButton("tomorrow");
  pDate.addButton("next week");
  pDate.addButton("other");
  pDate.addButton("no du date", undefined)
  pDate.isCancellable = false;
  pDate.show();
  // if buttonPressed is undefined no due date was selected
  const dateIsSet = (pDate.buttonPressed ? true : false);
  let selectedDateString = undefined;
  if (dateIsSet) {
    if (pDate.buttonPressed == "other") {
      var pSelDate = new Prompt();
      pSelDate.title = "select custom date";
      var today = new Date();
      var tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
      pSelDate.addDatePicker("dueDatePicker", "", tomorrow, {
        "mode": "date",
        "minimumDate": tomorrow
      });

      pSelDate.addButton("SET DATE");
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
  pPrio.title = "select priority:";
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
  pProject.title = "select project";
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
  pLabels.title = "select labels";
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


// helper fuctions to store settings and todoist data
// param types
// textArray: comma seperated stings

const settingsParamTypes = {
  "settingsDraftTags": "textArray",
  "dataStoreDraftTags": "textArray",
  "dataStoreUpdateInterval": "number"
}
const defaultSettingsParams = {
  "settingsDraftTags": [
    "_draftistSettings",
    "/ref-script"
  ],
  "dataStoreDraftTags": [
    "_draftistSettings",
    "/ref-script"
  ],
  "dataStoreUpdateInterval": 24
}

let activeSettings = undefined;
let lastUpdated = undefined;
let projects = undefined;
let labels = undefined;
let sections = undefined;
let projectsNameToIdMap = new Map();
let projectsIdToNameMap = new Map();
let labelsNameToIdMap = new Map();
let labelsIdToNameMap = new Map();


const settingsDraftName = "Draftist Action Group Settings";
const dataStoreDraftName = "Draftist Todoist Data Store";

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
    // TODO: DRAFTIST FAIL ACTION!
    return false;
  } else {
    // one settings Draft was found (or just created), read the settings from it into the active settings variable
    Draftist_readConfigurationSettingsFromDraft(resultDrafts[0]);
    return resultDrafts[0]
  }
}

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

function Draftist_createStorageDraft(draftName) {
  let storeDraft = new Draft();
  storeDraft.syntax = Syntax.find("builtIn", "JavaScript")
  storeDraft.content = "// " + draftName + "\n// DON'T MAKE ANY CHANGES TO THIS DRAFT! IT IS USED BY THE DRAFTIST ACTION GROUP\n";
  storeDraft.update();
  return storeDraft;
}

function Draftist_initConfigurationSettingsDraft(settingsDraft) {
  // set tags according to confiuration
  for (tag of defaultSettingsParams["settingsDraftTags"]) {
    settingsDraft.addTag(tag);
  }
  settingsDraft.content = settingsDraft.content + JSON.stringify(defaultSettingsParams)
  // workaround was not updated as expected.
  settingsDraft.update();
  settingsDraft.update();

}

function Draftist_initDataStoreDraft(storeDraft) {
  // set tags according to confiuration
  for (tag of defaultSettingsParams["dataStoreDraftTags"]) {
    storeDraft.addTag(tag);
  }
  // TODO: initially load totoist settings
  // workaround was not updated as expected.
  storeDraft.update();
  storeDraft.update();

}

function Draftist_readConfigurationSettingsFromDraft(settingsDraft) {
  activeSettings = Draftist_helperGetObjectFromStoredDraft(settingsDraft)
}

function Draftist_loadCurrentConfigurationSettings() {
  let settingsDraft = Draftist_findOrCreateSettingsDraft()
  Draftist_readConfigurationSettingsFromDraft(settingsDraft);

}

function Draftist_storeCurrentConfigurationSettings(settingsDraft) {
  Draftist_helperUpdateObjectInStoreDraft(settingsDraft, activeSettings)
}

function Draftist_changeConfigurationSettings(settingsDraft) {
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
    settingsDraft.update();
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



  // after all settings are reconfigured, store the new settings in the file
  Draftist_storeCurrentConfigurationSettings(settingsDraft);
}


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

function Draftist_updateStoredTodoistData(todoist = new Todoist()) {
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
  let storeDraft = Draftist_findOrCreateDataStoreDraft()
  Draftist_helperUpdateObjectInStoreDraft(storeDraft, todoistDataToStore)
}



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
