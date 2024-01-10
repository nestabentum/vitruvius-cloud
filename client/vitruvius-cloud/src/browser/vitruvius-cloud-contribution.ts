import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';

export const VitruviusCloudCommand: Command = {
    id: 'VitruviusCloud.command',
    label: 'Say Hello'
};

@injectable()
export class VitruviusCloudCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
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
