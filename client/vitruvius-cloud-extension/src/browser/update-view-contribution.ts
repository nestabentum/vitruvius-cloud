import { Command, CommandContribution, CommandRegistry,  QuickInputService, QuickPickItem, URI } from '@theia/core';
import { OpenerService } from '@theia/core/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileSystemUtils } from '@theia/filesystem/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ProgressCount } from './commit-view-command-contribution';
import { inject, injectable } from '@theia/core/shared/inversify';

export const UpdateViewCommand: Command = {
    id: 'VitruviusCloud.UpdateView',
    label: 'Vitruvius: Update View'
};

@injectable()
export class UpdateViewCommandContribution implements CommandContribution {
    constructor(
        @inject(QuickInputService) private readonly quickInputService: QuickInputService,
        @inject(FileService)
        protected readonly fileService: FileService,
        @inject(WorkspaceService)
        protected readonly workspaceService: WorkspaceService,
        @inject(OpenerService)
        protected readonly openerService: OpenerService,
        @inject(ProgressCount) private readonly progress: ProgressCount

    ) {}

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(UpdateViewCommand, {
            execute: async () => {
                let items = ['families', 'persons'];

                const quickPickItems: QuickPickItem[] = items.map(item => {
                    return { label: item };
                });
                const viewTypePicker = this.quickInputService.createQuickPick();
                viewTypePicker.onDidHide(() => viewTypePicker.dispose());
                viewTypePicker.onDidChangeSelection(async selection => {
                    const viewType = selection[0].label as 'families' | 'persons';
                    this.copy(viewType);
                });
                viewTypePicker.items = quickPickItems;
                viewTypePicker.show();
            }
        });
    }

    async copy(type: 'families' | 'persons') {
        const workspaceRootUri = this.workspaceService.getWorkspaceRootUri(undefined);
        if (!workspaceRootUri) {
            return;
        }

        const stat = await this.fileService.resolve(workspaceRootUri!);
        const statDir = stat.isDirectory ? stat : await this.fileService.resolve(workspaceRootUri.parent);

        const targetURI = stat.resource.resolve(`${type}.${type}`);
        const finalTargetUri = type === 'persons' ? FileSystemUtils.generateUniqueResourceURI(statDir, targetURI, false) : targetURI;

        const progress = this.progress.getProgress(type) 
        const sourceFileNumber = progress > 1 ? 1 : progress;

        const notationURI = URI.fromComponents({
            authority: workspaceRootUri.authority,
            scheme: workspaceRootUri.scheme,
            fragment: workspaceRootUri.fragment,
            path: workspaceRootUri.path.toString() + '/../../' + type + '-' + sourceFileNumber + '.' + type,
            query: workspaceRootUri.query
        });
        const familiesNotationUri = URI.fromComponents({
            path: workspaceRootUri.path.toString() + '/families.notation',
            authority: workspaceRootUri.authority,
            fragment: workspaceRootUri.fragment,
            query: workspaceRootUri.query,
            scheme: workspaceRootUri.scheme
        });
        this.fileService.readFile(notationURI).then(contents => {
            this.fileService.createFile(finalTargetUri, contents.value, { overwrite: true }).then(_ => {
                const uriToOpen = type === 'families' ? familiesNotationUri : finalTargetUri;

                this.openerService
                    .getOpener(uriToOpen)
                    .then(opener => {
                        opener.open(uriToOpen);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
        });
    }
}
