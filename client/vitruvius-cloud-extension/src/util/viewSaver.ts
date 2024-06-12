import { LocalStorageService, OpenerService, SingleTextInputDialog } from '@theia/core/lib/browser';
import { ILogger } from '@theia/core/lib/common';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { inject, injectable } from '@theia/core/shared/inversify';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileSystemUtils } from '@theia/filesystem/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import axios from 'axios';

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
    ) {}
    saveView = async (view: { fileEnding: string; view: string; id: string; resourceURI: string }) => {
        const contentBuffer = BinaryBuffer.fromString(view.view);
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
                        openHandler.open(finalURI);
                    });
                const workspaceUriLength = this.workspaceService.getWorkspaceRootUri(finalURI)?.toString().length ?? 0;
                const uriEncodedFileName = finalURI.toString().substring(workspaceUriLength + 1);
                axios
                    .get('http://localhost:8081/api/v2/register-view', {
                        params: { modeluri: uriEncodedFileName, originalResourceURI: view.resourceURI, viewURI: view.id }
                    })
                    .then(data => {
                        console.log('registration-success', data);
                    })
                    .catch(error => {
                        console.log('registration-error', error);
                    });
            }
        }
    };
}
