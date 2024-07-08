import { Command, CommandContribution, CommandRegistry, QuickInputService, QuickPickItem, URI } from '@theia/core';
import { OpenerService } from '@theia/core/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileSystemUtils } from '@theia/filesystem/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ProgressCount } from './commit-view-command-contribution';
import { inject, injectable } from '@theia/core/shared/inversify';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';

export const UpdateViewCommand: Command = {
    id: 'VitruviusCloud.UpdateView',
    label: 'Vitruvius: Update View'
};

const views: { [type: string]: string } = {
    families: `<?xml version="1.0" encoding="ASCII"?>
<families:FamilyRegister xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:families="edu.kit.ipd.sdq.metamodels.families" id="0">
  <families id="1" lastName="Herbertus">
    <sons id="5" firstName="Chris"/>
    <daughters id="4" firstName="Daria"/>
    <daughters id="6" firstName="Johanna"/>
    <father id="2" firstName="Anton"/>
    <mother id="3" firstName="Berta"/>
  </families>
</families:FamilyRegister>
`,
    persons: `<?xml version="1.0" encoding="ASCII"?>
<persons:PersonRegister xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:persons="edu.kit.ipd.sdq.metamodels.persons" id="pr">
  <persons xsi:type="persons:Male" id="p0" fullName="Chris Herbertus" birthday="1997-08-17T00:00:00.000+0100"/>
  <persons xsi:type="persons:Female" id="p1" fullName="Daria Herbertus" birthday="1999-08-18T00:00:00.000+0100"/>
  <persons xsi:type="persons:Male" id="p2" fullName="Anton Herbertus" birthday="1975-08-17T00:00:00.000+0100"/>
  <persons xsi:type="persons:Female" id="p3" fullName="Berta Herbertus" birthday="1972-08-17T00:00:00.000+0100"/>
  <persons xsi:type="persons:Female" id="p4" fullName="New Daughter Herbertus" birthday="1972-08-17T00:00:00.000+0100"/>
</persons:PersonRegister>
`
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
                    viewTypePicker.hide();
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

        const complimentaryType: 'families' | 'persons' = type === 'families' ? 'persons' : 'families';
        const progress = this.progress.getProgress(complimentaryType);
        if (progress === 0) {
            return;
        }

        // const notationURI = URI.fromComponents({
        //     authority: workspaceRootUri.authority,
        //     scheme: workspaceRootUri.scheme,
        //     fragment: workspaceRootUri.fragment,
        //     path: workspaceRootUri.path.toString() + '/../../' + type + '-' + sourceFileNumber + '.' + type,
        //     query: workspaceRootUri.query
        // });
        const familiesNotationUri = URI.fromComponents({
            path: workspaceRootUri.path.toString() + '/families.notation',
            authority: workspaceRootUri.authority,
            fragment: workspaceRootUri.fragment,
            query: workspaceRootUri.query,
            scheme: workspaceRootUri.scheme
        });

        const content = views[type];
        // this.fileService.readFile(notationURI).then(contents => {
        this.fileService.createFile(finalTargetUri, BinaryBuffer.fromString(content), { overwrite: true }).then(_ => {
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
        // });
    }
}
