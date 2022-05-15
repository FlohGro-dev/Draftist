# Draftist Action Group Instructions

**created by [@FlohGro](https://mobile.twitter.com/FlohGro)**

- **Website:** [flohgro.com](https://flohgro.com)  
- **Drafts Forums:** [@FlohGro](https://forums.getdrafts.com/u/flohgro/summary)
- **Twitter:** [@FlohGro](https://twitter.com/FlohGro)

> Welcome to Draftist - an Action Group for Draft to integrate with Todoist. This might be the most advanced Action Group to use Drafts with Todoist so please read the instructions.
> Before running any other Action, you have to run the "Draftist Setup/Update" Action which downloads the latest version of Draftist from the repository

Draftist contains a big amount of Actions to integrate Drafts with Todoist.

The Actions are divided into the following sections:

- General
- Quick Add Tasks
- Create Single Task
- Create (cross)Linked Task From Draft
- Create Multiple Tasks
- Create Tasks from MD Tasks in Draft
- Import Tasks
- Modify Tasks

Before running any Action in this Action Group, make sure to Setup the `Draftist.js` file in your directory by running the `Draftist Setup/Update` Action.

## Using Draftist

Since Draftist contains a lot of Actions and you may not need every single of them you may want to create your own `my Draftist` Action Group to only include the Actions you want.
While you can duplicate / move the Actions you use to your own Action Group(s) I recommend to leave the Draftist Action Group untouched. This ensures a single point of truth and if I need to fix/maintain Actions in Draftist your own Actions will work afterwards. Instead you can use the `Draftist Action Replicator` Action to reinstall an existing Draftist Action to your `my Draftist` Action Group. When you replicated a Draftist Action you can then give your own action a (shorter) name than in the Draftist Action Group (especially on mobile devices the names of some actions are too long to distinguish them easily.).
This is also useful if you want to use Actions with configuration options (to e.g. retrieve tasks from a filter) with different configurations. Then you can use the `Draftist Action Replicator` to replicate the same Action from Draftist several times and configure them to your needs.
You can assign keyboard shortcuts to the Actions you created to make them easily accessible (none of the Actions in Draftist has a keyboard shortcut assigned to don't conflict with your assignments).

Please **never** rename the `Draftist` Action at the top of the Action Group (If you do so, no other Action will work anymore).

Draftist is not displayed as Action Bar (over the keyboard) by default since (again) it contains a lot of Actions which sometimes use the same icons. If you want access to the Actions in the Action Bar - again i recommend to replicate the subset of Draftist Actions you need into your own Action Group and then display these Actions in the Action Bar.

## Action Descriptions

Every Draftist Action contains a short description about its purpose / what it does. Due to the big amount of Actions you can also read through all descriptions in the [Action Descriptions](https://github.com/FlohGro-dev/Draftist/blob/main/Action%20Descriptions.md) file.

## Customizing Actions

All Draftist Actions work out of the box with no needed configuration from you. Especially the more complex and powerful actions allow you to configure the behavior of them in the action steps. Read through the corresponding [Action Description](https://github.com/FlohGro-dev/Draftist/blob/main/Action%20Descriptions.md) to find instructions what and how you can configure the Action to your need.

## Support Development

Draftist is completely free to use for you. However if this Action Group is useful for you and supports your workflows you can give something back to support development.
I enjoy a good coffee ☕️ (weather at home or in an actual coffee shop) and love pizza 🍕.
You can choose the amount you want to donate on those platforms.

<a href="https://www.buymeacoffee.com/flohgro" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 220px !important;" ></a>

<a href="https://www.patreon.com/flohgro" target="_blank"><img src="https://user-images.githubusercontent.com/13785667/162812708-55b96cdc-8c32-4433-a340-6dd4c1f7326d.jpg" alt="Become A patreon" style="height: 110px !important;width: 220px !important;" ></a>

## Feature Requests and Issue Reporting

If you encounter any issues or have additional feature requests you can reach out to me in different ways:

- report / request issues in the GitHub repository [here](https://github.com/FlohGro-dev/Draftist/issues)
- take part in the conversation in the Drafts forums [here](https://forums.getdrafts.com/u/flohgro/summary)
- contact me on other platforms of your choice [here](https://flohgro.com/contactme)

## Created Files

Draftist will create three new files in your iCloud Drive folder at the path `.../Drafts/Library/Scripts`:

- `DraftistDataStore.json`: Draftist Todoist Data Store
  - this file stores data from your Todoist account which is used by several actions
  - the data includes:
    - projects (and their metadata)
    - sections (and their metadata)
    - labels (and their metadata)
  - none of this data leaves your iCloud Account, it is synced in the Drafts directory - it's just used to not always request the data from Todoists API which slows down the process of e.g. creating tasks with settings a lot.
- `DraftistSettings.json`: Draftist Action Group Settings
  - this file stores the settings you can modify with the [Draftist Settings Action](https://github.com/FlohGro-dev/Draftist/blob/main/Action%20Descriptions.md#Draftist%20Settings)
- `Draftist.js`: Draftist Functions
  - this file contains the functions all the Draftist Actions use under the hood. This enables the update process without the need to reinstall the complete Action Group.

I don't recommend to delete these files unless you have issues using Draftist. If you delete the `Draftist.js` no Action in the Draftist Action Group will work anymore until you reinstall the file. The Settings and Data Store file will be recreated automatically.

## Changelog

To stay up to date on new updates you can follow me on [Twitter](https://twitter.com/FlohGro) or take part in the converstaion in the [Drafts forums post](https://forums.getdrafts.com/u/flohgro/summary)
You can find a changelog of updates to Action Group in the [Changelog](https://github.com/FlohGro-dev/Draftist#changelog) section of the README in this repository.
