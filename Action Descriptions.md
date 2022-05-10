# Draftist Action Descriptions

<!-- TOC -->

- [Draftist Action Descriptions](#draftist-action-descriptions)
  - [General Actions](#general-actions)
    - [Draftist Instructions](#draftist-instructions)
    - [Draftist](#draftist)
    - [Draftist Settings](#draftist-settings)
    - [Draftist Action Replicator](#draftist-action-replicator)
    - [Draftist Update](#draftist-update)
    - [Update local Todoist data](#update-local-todoist-data)
  - [Quick Add Tasks](#quick-add-tasks)
    - [quick add lines from draft](#quick-add-lines-from-draft)
    - [quick add lines from prompt](#quick-add-lines-from-prompt)
  - [Create Single Task](#create-single-task)
    - [task with description from draft](#task-with-description-from-draft)
    - [task with description from prompt](#task-with-description-from-prompt)
    - [task with description & settings from draft](#task-with-description--settings-from-draft)
    - [task with description & settings from prompt](#task-with-description--settings-from-prompt)
  - [Create (cross)Linked Task From Draft](#create-crosslinked-task-from-draft)
    - [create linked task in inbox](#create-linked-task-in-inbox)
    - [create linked task with settings](#create-linked-task-with-settings)
    - [create crosslinked task in inbox](#create-crosslinked-task-in-inbox)
    - [create crosslinked task with settings](#create-crosslinked-task-with-settings)
  - [Create Multiple tasks](#create-multiple-tasks)
    - [tasks with same settings from draft](#tasks-with-same-settings-from-draft)
    - [tasks with same settings from prompt](#tasks-with-same-settings-from-prompt)
    - [tasks with individual settings from draft](#tasks-with-individual-settings-from-draft)
    - [tasks with individual settings from prompt](#tasks-with-individual-settings-from-prompt)
  - [Create Tasks from MD Tasks in Draft](#create-tasks-from-md-tasks-in-draft)
    - [quick add tasks from md tasks in draft](#quick-add-tasks-from-md-tasks-in-draft)
    - [tasks with same settings from md tasks in draft](#tasks-with-same-settings-from-md-tasks-in-draft)
    - [tasks with individual settings from md tasks in draft](#tasks-with-individual-settings-from-md-tasks-in-draft)
  - [Import Tasks](#import-tasks)
    - [import todays tasks](#import-todays-tasks)
    - [import tasks from project](#import-tasks-from-project)
    - [import tasks from selected project](#import-tasks-from-selected-project)
    - [import tasks with all configured label(s)](#import-tasks-with-all-configured-labels)
    - [import tasks with any configured label(s)](#import-tasks-with-any-configured-labels)
    - [import tasks with all selected label(s)](#import-tasks-with-all-selected-labels)
    - [import tasks with any selected label(s)](#import-tasks-with-any-selected-labels)
    - [import tasks from filter](#import-tasks-from-filter)
    - [import tasks from filter in prompt](#import-tasks-from-filter-in-prompt)

<!-- /TOC -->


Here you will find all descriptions of the Actions in Draftist.
The description will also contain the default settings for the "after success" option in the Action.

## General Actions

### Draftist Instructions

> This Action presents instructions on how to use the Draftist Action Group.

> After Success Setting: Nothing

### Draftist

> This Action loads all relevant functions that Draftist provides. Every Draftist Action includes this Action.
If you want to make you're own Action based on Draftist functions simply include this Action at the beginning.

> After Success Setting: Nothing

### Draftist Settings

> This Action allows changing the default settings of Draftist or restore the default settings based on the user selections.

> After Success Setting: Nothing

### Draftist Action Replicator

> This Action eases the replication of an Action in the Draftist Action Group. When a user runs this Action it will display a prompt with all available Draftist Actions as buttons. When the user selects one action the installURL of this Action will be opened. This results in an *Action Import* prompt. Make sure to select `Import as New Action` in the prompt and select the destination Action Group of the replicated Action. After the Action is installed rename it to your personal choice.

> After Success Setting: Nothing

### Draftist Update

> **TODO**

> After Success Setting:

### Update local Todoist data

> This Action forces an update of the locally stored Todoist data. Use this if you e.g. just created a new project / label that you want to use immediately. Updates will be performed after 24 hours by default - you can change this using the [Draftist Settings](#draftist-settings) action.

> After Success Setting: Nothing

## Quick Add Tasks

### quick add lines from draft

> This Action will create a new task in Todoist for each line in the current draft. The content of each line will be parsed by todoist, so you can e.g. use dates or project/label notation in each lines just like you normally would directly in Todoist.

> After Success Setting: Trash

### quick add lines from prompt

> This Action will create a new task in Todoist for each line you type into the displayed prompt. The content of each line will be parsed by todoist, so you can e.g. use dates or project/label notation in each lines just like you normally would directly in Todoist.

> After Success Setting: Nothing

## Create Single Task

### task with description from draft

> This Action creates a task in the inbox of Todoist with the body of the draft as description. This means that the first line of the current draft will be used as the content of the task and everything else will be used as the description.

> After Success Setting: Trash

### task with description from prompt

> This Action creates a task in the inbox of Todoist with a description from the text you type into the displayed prompt. The first line of the text in the prompt will be used as the content of the task and everything else will be used as the description.

> After Success Setting: Nothing

### task with description & settings from draft

> This Action creates a task from the title (first line) of the current draft in Todoist with settings (due date, project, labels) from prompts and the body of the draft as description. This means that the first line of the current draft will be used as the content of the task and everything else will be used as the description.

> After Success Setting: Trash

### task with description & settings from prompt

> This Action creates a task in Todoist with content, description and settings (due date, project, labels) from prompts. The first line of the text in the "add task with description & settings" prompt will be used as the content of the task and everything else will be used as the description.

> After Success Setting: Nothing

## Create (cross)Linked Task From Draft

### create linked task in inbox

> This Action creates a task in the inbox of Todoist with the displayed title of the current draft as content. The created Task will contain a clickable link to directly open the linked draft.

> After Success Setting: Nothing

### create linked task with settings

> This Action creates a task with settings (due date, project, labels) from prompts with the displayed title of the current draft as content. The created Task will contain a clickable link to directly open the linked draft.

> After Success Setting: Nothing

### create crosslinked task in inbox

> This Action creates a crosslinked task in the inbox of Todoist with the displayed title of the current draft as content. The created Task will contain a clickable link to directly open the linked draft. The link to the created task will be added between the title and the body of the current draft. The added link types (app, web) can be configured with the `Draftist Settings` Action.

> After Success Setting: Nothing

### create crosslinked task with settings

> This Action creates a crosslinked task with settings (due date, project, labels) from prompts in the inbox of Todoist with the displayed title of the current draft as content. The created Task will contain a clickable link to directly open the linked draft. The link to the created task will be added between the title and the body of the current draft. The added link types (app, web) can be configured with the `Draftist Settings` Action.

> After Success Setting: Nothing

## Create Multiple tasks

### tasks with same settings from draft

> This Action creates a task for each line in the current draft. Each task will use the same settings (due date, project, labels) you select in the displayed prompts.

> After Success Setting: Trash

### tasks with same settings from prompt

> This Action will create a new task in Todoist for each line you type into the displayed prompt. Each task will use the same settings (due date, project, labels) you select in the displayed prompts.

> After Success Setting: Nothing

### tasks with individual settings from draft

> This Action creates a task for each line in the current draft. The settings (due date, project, label) can be set individually for each task in displayed prompts

> After Success Setting: Trash

### tasks with individual settings from prompt

> This Action creates a task for each line you type in the first prompt. The settings (due date, project, label) can be set individually for each task in displayed prompts
>  
> After Success Setting Nothing

## Create Tasks from MD Tasks in Draft

### quick add tasks from md tasks in draft

> This Action will create a new task for each md task ("- [ ]") in the current draft. Similar to the [quick add lines from draft](#quick-add-lines-from-draft) the contents of the tasks will be parsed by Todoist.

> After Success Setting: Noting

### tasks with same settings from md tasks in draft

> This Action will create tasks with identical settings for each md task ("- [ ]") in the current draft. The Action will display prompts to select the settings (due date, labels, project)

> After Success Setting: Nothing

### tasks with individual settings from md tasks in draft

> This Action will create tasks with individual settings for each md task ("- [ ]") in the current draft. The Action will display prompts for each task to select the individual settings (due date, labels, project)

> After Success Setting: Nothing

## Import Tasks

### import todays tasks

> This Action imports the tasks due today and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action.

> After Success Setting: Nothing

### import tasks from project

> This Action imports the tasks from the configured project and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action. To configure the project which should be used by the Action, edit the "Define Template Tag" step and change the Template from "UNCONFIGURED" to the project name (best you copy the name from your Todoist project).

> After Success Setting: Nothing

### import tasks from selected project

> This Action imports the tasks from the selected project and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action.

> After Success Setting: Nothing


### import tasks with all configured label(s)

> This Action imports tasks which contain all configured labels and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action. To configure the labels which should be used by the Action, edit the "Define Template Tag" step and change the Template from "UNCONFIGURED" to the label names (best you copy the names from your Todoist labels) and separate them by commas with no spaces in between.

> After Success Setting: Nothing

### import tasks with any configured label(s)

> This Action imports tasks which contain any configured label and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action. To configure the labels which should be used by the Action, edit the "Define Template Tag" step and change the Template from "UNCONFIGURED" to the label names (best you copy the names from your Todoist labels) and separate them by commas with no spaces in between.

> After Success Setting: Nothing

### import tasks with all selected label(s)

> This Action imports tasks which contain all selected labels and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action.

> After Success Setting: Nothing

### import tasks with any selected label(s)

> This Action imports tasks which contain any selected label and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action.

> After Success Setting: Nothing

### import tasks from filter

> This Action imports tasks for the configured filter and appends them to the current draft. The meta information included for each task can be configured with the `Draftist Settings` Action. To configure the used filter , edit the "Define Template Tag" step and change the Template from "UNCONFIGURED" to the filter query you want to use (best you test the filter in todoist and then copy it into the template step).

> After Success Setting: Nothing

### import tasks from filter in prompt

> This Action imports tasks for the filter query provided into the text field of the presented prompt. The meta information included for each task can be configured with the `Draftist Settings` Action.

> After Success Setting: Nothing
