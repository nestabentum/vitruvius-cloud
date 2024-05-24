import { injectable, inject } from '@theia/core/shared/inversify';
import {
    Command,
    CommandContribution,
    CommandRegistry,
    ILogger,
    MenuContribution,
    MenuModelRegistry,
    MessageService,
    QuickInputService,
    QuickPickItem
} from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';
import { ViewTypes, getView, getViewTypes } from '../api/api';
import { ViewSaver } from '../util/viewSaver';

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
        @inject(QuickInputService) private readonly quickInputService: QuickInputService,
        @inject(ILogger) private readonly logger: ILogger,
        @inject(ViewSaver) private readonly viewSaver: ViewSaver
    ) {}

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(FetchViewTypesCommand, {
            execute: async () => {
                let items: ViewTypes = [];

                await getViewTypes()
                    .then(data => {
                        items = data.data;
                    })
                    .catch(error => {
                        this.logger.error(error);
                    });

                const quickPickItems: QuickPickItem[] = items.map(item => {
                    return { label: item };
                });
                const viewTypePicker = this.quickInputService.createQuickPick();
                viewTypePicker.onDidHide(() => viewTypePicker.dispose());
                viewTypePicker.onDidChangeSelection(async selection => {
                    await getView(selection[0].label, this.logger).then(result => {
                        this.viewSaver.saveView(result);
                    });
                });
                viewTypePicker.items = quickPickItems;
                viewTypePicker.show();
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
