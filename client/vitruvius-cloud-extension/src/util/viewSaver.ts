import { inject, injectable } from '@theia/core/shared/inversify';
import { OpenerService } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { ILogger } from '@theia/core/lib/common';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import { FileSystemUtils } from '@theia/filesystem/lib/common';

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
        protected readonly workspaceService: WorkspaceService
    ) {}
    saveView = async (view: string) => {
        const contentBuffer = BinaryBuffer.fromString(view);

        const fileURI = this.workspaceService.getWorkspaceRootUri(undefined);
        if (fileURI) {
            const stat = await this.fileService.resolve(fileURI!);
            const statDir = stat.isDirectory ? stat : await this.fileService.resolve(fileURI.parent);
            const targetURI = stat.resource.resolve('families.families');
            FileSystemUtils.generateUniqueResourceURI(statDir, targetURI, false);
            this.fileService
                .createFile(targetURI, contentBuffer)
                .then(_ => this.openerService.getOpener(targetURI))
                .then(openHandler => openHandler.open(targetURI));
        }
    };
}
