# Vitruvius Cloud User Study

## Context
Prototypical development of a modern tool that enables the use of the Vitruvius Framework.
The Vitruvius Framework is the implementation of the Vitruvius approach. The Vitruvius approach is a view-based modeling approach. It is described in more detail at https://www.sciencedirect.com/science/article/pii/S0164121220302144

From the Vitruvius approach, a git-like workflow is derived for this tool, Vitruvius Cloud:
Vitruvius' Virtual Single Underlying Model (VSUM) corresponds to a central online repository that contains several models. From this repository, you can check out views for local work. These views represent different perspectives or excerpts of the VSUM. On these views, users can make changes local. If these changes are to be persisted in the VSUM, users must explicitly commit the changes. The Vitruvius Framework processes these changes and applies them to the affected models in the VSUM.


## Instructions

Below you will find the step-by-step instructions for the task you need to perform.

1. Open the command palette using ctrl + shift + P. Check out both the 'persons' and the 'families' view using the 'Fetch View' command.
2. Look at the open editors and make sure that they pose two different views of the same model data
3. Add a daughter to the graphical 'families' model using the tool palette in the top right-hand corner of the editor. Click 'AddDaughter' and then click on the position in the editor where you want to place the new model element.
4. You can now save your progress locally by pressing Ctrl + S
5. Now commit your changes to the VSUM by opening the command palette with ctrl + shift + P and selecting the command 'Commit Changes' and 'families', consequently
6. Now switch to the editor of the 'persons.persons' file. Make sure that the daughter you have just added is not yet visible in this view. An explicit update is necessary for this.
7. Select the command 'Update View' via the command palette (ctrl + shift + p) and select 'persons'
8. Make sure that you can see the new model state, i.e. the newly added daughter, in the newly created file (persons 1.persons)
9. Rename the new daughter to 'Johanna' in this view
10. Use ctrl + S to save your changes locally
11. Use the 'Commit View' command from the command palette (str + shift + P) to commit your changes in the 'persons' view to the VSUM
12. Switch to the 'families.notation' file. Make sure that you do not yet see the change you have just made
13. Select the command 'Update View' via the command palette (ctrl + shift + p) and select 'families'
14. Due to technical limitations of the prototype, it is necessary to close and reopen the families.notation tab so that you can see the update of the view. After you have done this, make sure you see the new model state, i.e. the daughter named Johanna

You have reached the end of the task. Now return to the survey!
