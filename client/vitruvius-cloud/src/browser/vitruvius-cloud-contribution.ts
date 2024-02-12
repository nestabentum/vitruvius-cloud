import { injectable, inject } from '@theia/core/shared/inversify';
import {
    Command,
    CommandContribution,
    CommandRegistry,
    MenuContribution,
    MenuModelRegistry,
    MessageService,
    QuickInputService,
    QuickPickItem
} from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';

export const VitruviusCloudCommand: Command = {
    id: 'VitruviusCloud.command',
    label: 'Say Hello'
};
export const FetchViewTypesCommand: Command = {
    id: 'VitruviusCloud.FetchViewTypes',
    label: 'Fetch View Types'
};
@injectable()
export class VitruviusCloudCommandContribution implements CommandContribution {
    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(QuickInputService) private readonly quickInputService: QuickInputService
    ) {}

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(FetchViewTypesCommand, {
            execute: () => {
                const quickPickItems: QuickPickItem[] = [{ label: 'Type 1' }, { label: 'Type 2' }];
                const viewTypePicker = this.quickInputService.createQuickPick();
                viewTypePicker.onDidHide(() => viewTypePicker.dispose());

                viewTypePicker.items = quickPickItems;
                viewTypePicker.show()
            }
        });
        registry.registerCommand(VitruviusCloudCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class VitruviusCloudMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: VitruviusCloudCommand.id,
            label: VitruviusCloudCommand.label
        });
    }
}
