import { LocalStorageService, OpenerService, SingleTextInputDialog } from '@theia/core/lib/browser';
import { ILogger } from '@theia/core/lib/common';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { inject, injectable } from '@theia/core/shared/inversify';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileSystemUtils } from '@theia/filesystem/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser';

@injectable()
export class ViewSaver {
    constructor(
        @inject(OpenerService)
        protected readonly openerService: OpenerService,
        @inject(FileService)
        protected readonly fileService: FileService,
        @inject(ILogger)
        protected readonly logger: ILogger,
        @inject(WorkspaceService)
        protected readonly workspaceService: WorkspaceService,
        @inject(LocalStorageService)
        private readonly localStorageSrevice: LocalStorageService
    ) {}
    saveView = async (view: { fileEnding: string; view: string; id: string; resourceURI: string }) => {
        console.log('view', view);
        const contentBuffer = BinaryBuffer.fromString(view.view);
        console.log(this.localStorageSrevice);
        const fileURI = this.workspaceService.getWorkspaceRootUri(undefined);
        if (fileURI) {
            const stat = await this.fileService.resolve(fileURI!);
            const statDir = stat.isDirectory ? stat : await this.fileService.resolve(fileURI.parent);
            const targetURI = stat.resource.resolve(`${view.fileEnding}.${view.fileEnding}`);
            const preliminaryFileUri = FileSystemUtils.generateUniqueResourceURI(statDir, targetURI, false);

            const dialog = new SingleTextInputDialog({ title: 'Set File Name', initialValue: preliminaryFileUri.path.base });
            const fileName = await dialog.open();
            if (fileName) {
                const finalURI = stat.resource.resolve(fileName);
                this.fileService
                    .createFile(finalURI, contentBuffer)
                    .then(_ => this.openerService.getOpener(finalURI))
                    .then(openHandler => {
                        this.localStorageSrevice.setData(finalURI.toString(), { id: view.id, resourceURI: view.resourceURI });
                        openHandler.open(finalURI);
                    });
            }
        }
    };
}
