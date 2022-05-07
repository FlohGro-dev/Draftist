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
  - [Create Single Tasks](#create-single-tasks)
    - [task with description from draft](#task-with-description-from-draft)
    - [task with description from prompt](#task-with-description-from-prompt)
    - [task with description & settings from draft](#task-with-description--settings-from-draft)
    - [task with description & settings from prompt](#task-with-description--settings-from-prompt)
  - [Create Multiple tasks](#create-multiple-tasks)
    - [tasks with same settings from draft](#tasks-with-same-settings-from-draft)
    - [tasks with same settings from prompt](#tasks-with-same-settings-from-prompt)
    - [tasks with individual settings from draft](#tasks-with-individual-settings-from-draft)
    - [tasks with individual settings from draft](#tasks-with-individual-settings-from-draft-1)
  - [Create Tasks from MD Tasks in Draft](#create-tasks-from-md-tasks-in-draft)
    - [quick add tasks from md tasks in draft](#quick-add-tasks-from-md-tasks-in-draft)
    - [create tasks with same settings from md tasks in draft](#create-tasks-with-same-settings-from-md-tasks-in-draft)
    - [create tasks with individual settings from md tasks in draft](#create-tasks-with-individual-settings-from-md-tasks-in-draft)
    - [[]](#)
    - [[]](#-1)
    - [[]](#-2)
    - [[]](#-3)
    - [[]](#-4)
    - [[]](#-5)
    - [[]](#-6)
    - [[]](#-7)
    - [[]](#-8)
    - [[]](#-9)

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

### tasks with individual settings from draft

> This Action creates a task for each line you type in the first prompt. The settings (due date, project, label) can be set individually for each task in displayed prompts

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


### []

>

> After Success Setting:


### []

>

> After Success Setting:


### []

>

> After Success Setting:
