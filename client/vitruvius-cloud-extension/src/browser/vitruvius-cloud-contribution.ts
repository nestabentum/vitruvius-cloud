import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, ILogger, QuickInputService, QuickPickItem } from '@theia/core/lib/common';
import { getView } from '../api/api';
import { ViewSaver } from '../util/viewSaver';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { OpenerService } from '@theia/core/lib/browser';

export const FetchViewTypesCommand: Command = {
    id: 'VitruviusCloud.FetchViewTypes',
    label: 'Vitruvius: Fetch View'
};
@injectable()
export class VitruviusCloudCommandContribution implements CommandContribution {
    constructor(
        @inject(QuickInputService) private readonly quickInputService: QuickInputService,
        @inject(ILogger) private readonly logger: ILogger,
        @inject(ViewSaver) private readonly viewSaver: ViewSaver,
        @inject(FileService)
        protected readonly fileService: FileService,
        @inject(WorkspaceService)
        protected readonly workspaceService: WorkspaceService,
        @inject(OpenerService)
        protected readonly openerService: OpenerService
    ) {}

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(FetchViewTypesCommand, {
            execute: async () => {
                let items = ['families', 'persons'];
                const quickPickItems: QuickPickItem[] = items.map(item => {
                    return { label: item };
                });
                const viewTypePicker = this.quickInputService.createQuickPick();
                viewTypePicker.onDidHide(() => viewTypePicker.dispose());
                viewTypePicker.onDidChangeSelection(async selection => {
                    const viewType = selection[0].label as 'families' | 'persons';
                    await getView(viewType, this.logger).then(result => {
                        this.viewSaver.saveView(result);
                        viewTypePicker.hide();
                    });
                });
                viewTypePicker.items = quickPickItems;
                viewTypePicker.show();
            }
        });
    }
}
