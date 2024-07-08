# Vitruvius Cloud User Study

## Context

The Vitruvius Framework is the implementation of the Vitruvius approach. The Vitruvius approach is a view-based modeling approach. It is described in more detail at <https://www.sciencedirect.com/science/article/pii/S0164121220302144>

From the Vitruvius approach, a git-like workflow is derived for this tool, Vitruvius Cloud:
Vitruvius' Virtual Single Underlying Model (VSUM) corresponds to a central online repository that contains several models.
From this repository, you can check out views for local work. These views represent different perspectives or excerpts of the VSUM. 
On these views, users can make changes local. If these changes are to be persisted in the VSUM, users must explicitly commit the changes.
The Vitruvius Framework processes these changes and applies them to the affected models in the VSUM.

## Instructions

Below you will find the step-by-step instructions for the task you need to perform.

1. Open the command palette (ctrl + shift + P or 'View' > 'Command Palette'). Check out the 'persons' View using the 'Fetch View' command. This command writes the file 'persons.persons' to your workspace and also opens it.
    The file should be displayed in the tree editor. If there are problems displaying the file, close the file and open it again
2. Check out the 'families' view as in 1. This command writes 2 files to your workspace: 'families.families. and 'families.notation'.
    'families.families' is the actual semantic model and 'families.notation' is the corresponding graphical representation. The command opens 'families.notation'
3. Look at the open files and make sure that they pose two different views of the same model data
4. Add a daughter to the graphical 'families' model using the tool palette in the top right-hand corner of the editor. Click 'AddDaughter' and then click on the position in the editor where you want to place the new model element (in some browsers a double click might be necessary).
5. You can now save your progress locally by pressing Ctrl + S
6. Now commit your changes to the VSUM by opening the command palette with ctrl + shift + P and selecting the command 'Commit Changes' and 'families', consequently
7. Now switch to the editor of the 'persons.persons' file. Make sure that the daughter you have just added is not yet visible in this view. An explicit update is necessary for this.
8. Select the command 'Update View' via the command palette (ctrl + shift + p) and select 'persons'
9. Make sure that you can see the new model state, i.e. the newly added daughter, in the newly created file (persons 1.persons)
10. Rename the new daughter to 'Johanna' in this view
11. Use ctrl + S to save your changes locally
12. Use the 'Commit View' command from the command palette (str + shift + P) to commit your changes in the 'persons' view to the VSUM
13. Switch to the 'families.notation' file. Make sure that you do not yet see the change you have just made
14. Select the command 'Update View' via the command palette (ctrl + shift + p) and select 'families'
15. Due to technical limitations of the prototype, it is necessary to close and reopen the families.notation tab so that you can see the update of the view. After you have done this, make sure you see the new model state, i.e. the daughter named Johanna

You have reached the end of the task. Now return to the survey!
