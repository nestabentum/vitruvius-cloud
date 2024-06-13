import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, ILogger, QuickInputService, QuickPickItem, URI } from '@theia/core/lib/common';
import { ViewTypes, getView, getViewTypes } from '../api/api';
import { ViewSaver } from '../util/viewSaver';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { OpenerService } from '@theia/core/lib/browser';

export const FetchViewTypesCommand: Command = {
    id: 'VitruviusCloud.FetchViewTypes',
    label: 'Fetch View'
};
const counts: { [key: string]: number } = {
    families: 0,
    persons: 0
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
                    const viewType = selection[0].label as 'families' | 'persons';
                    if (counts[viewType] == 0) {
                        await getView(viewType, this.logger).then(result => {
                            this.viewSaver.saveView(result);
                            viewTypePicker.hide();
                        });
                    } else {
                        this.copy(viewType);
                    }
                    counts[viewType]++;
                });
                viewTypePicker.items = quickPickItems;
                viewTypePicker.show();
            }
        });
    }

    copy(type: 'families' | 'persons') {
        const workspaceRootUri = this.workspaceService.getWorkspaceRootUri(undefined);
        if (!workspaceRootUri) {
            return;
        }
        const targetUri = URI.fromComponents({
            path: workspaceRootUri.path.toString() + '/' + type + '.' + type,
            authority: workspaceRootUri.authority,
            fragment: workspaceRootUri.fragment,
            query: workspaceRootUri.query,
            scheme: workspaceRootUri.scheme
        });

        const notationURI = URI.fromComponents({
            authority: workspaceRootUri.authority,
            scheme: workspaceRootUri.scheme,
            fragment: workspaceRootUri.fragment,
            path: workspaceRootUri.path.toString() + '/../../' + type + '-' + counts[type] + '.' + type,
            query: workspaceRootUri.query
        });
        this.fileService.readFile(notationURI).then(contents => {
            this.fileService.createFile(targetUri, contents.value, { overwrite: true }).then(_ =>
                this.openerService
                    .getOpener(targetUri)
                    .then(opener => opener.open(targetUri))
                    .catch(error => {
                        console.log(error);
                    })
            );
        });
    }
}
