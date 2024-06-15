import { Command, CommandContribution, CommandRegistry, QuickInputService, QuickPickItem } from '@theia/core';
import { inject, injectable } from '@theia/core/shared/inversify';

export const CommitViewCommand: Command = {
    id: 'VitruviusCloud.CommitView',
    label: 'Vitruvius: Commit View'
};

@injectable()
export class ProgressCount {
    constructor() {
        this.viewProgressCount = {
            families: 0,
            persons: 0
        };
    }
    viewProgressCount: { [key: string]: number };

    getProgress(viewType: 'families' | 'persons') {
        console.log('FETCHING PROGRESS', this.viewProgressCount);
        return this.viewProgressCount[viewType];
    }

    increaseProgress(viewType: 'families' | 'persons') {    
        this.viewProgressCount[viewType]++;
        console.log('INCREASED PROGRESS', this.viewProgressCount);
    
    }
}
@injectable()
export class CommitViewCommandContribution implements CommandContribution {
    constructor(
        @inject(QuickInputService) private readonly quickInputService: QuickInputService,
        @inject(ProgressCount) private readonly progress: ProgressCount
    ) {}

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(CommitViewCommand, {
            execute: async () => {
                let items = ['families', 'persons'];
                const quickPickItems: QuickPickItem[] = items.map(item => {
                    return { label: item };
                });
                const viewTypePicker = this.quickInputService.createQuickPick();
                viewTypePicker.onDidHide(() => viewTypePicker.dispose());
                viewTypePicker.onDidChangeSelection(async selection => {
                    this.progress.increaseProgress(selection[0].label as 'families' | 'persons');
                    console.log('INCREASED COUNT ', this.progress.getProgress(selection[0].label as 'families' | 'persons'));
                    viewTypePicker.hide();
                });
                viewTypePicker.items = quickPickItems;
                viewTypePicker.show();
            }
        });
    }
}
