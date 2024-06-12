import { OpenerService } from '@theia/core/lib/browser';
import { ILogger, URI } from '@theia/core/lib/common';
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
        protected readonly workspaceService: WorkspaceService
    ) {}
    saveView = async (view: { fileEnding: string; view: string; id: string; resourceURI: string }) => {
        const contentBuffer = BinaryBuffer.fromString(view.view);
        const workspaceRootUri = this.workspaceService.getWorkspaceRootUri(undefined);
        if (workspaceRootUri) {
            const fileURI = workspaceRootUri;
            const stat = await this.fileService.resolve(fileURI!);
            const statDir = stat.isDirectory ? stat : await this.fileService.resolve(fileURI.parent);

            const targetURI = stat.resource.resolve(`${view.fileEnding}.${view.fileEnding}`);
            const preliminaryFileUri = FileSystemUtils.generateUniqueResourceURI(statDir, targetURI, false);

            const fileName = preliminaryFileUri.path.base;
            if (fileName) {
                const finalURI = stat.resource.resolve(fileName);
                this.fileService
                    .createFile(finalURI, contentBuffer, { overwrite: true })
                    .then(_ => {
                        return this.openerService.getOpener(finalURI);
                    })
                    .then(openHandler => {
                        if (view.fileEnding !== 'families') {
                            openHandler.open(finalURI, { mode: 'reveal' });
                        }
                    });

                const targetNotationUri = URI.fromComponents({
                    path: workspaceRootUri.path.toString() + '/families.notation',
                    authority: workspaceRootUri.authority,
                    fragment: workspaceRootUri.fragment,
                    query: workspaceRootUri.query,
                    scheme: workspaceRootUri.scheme
                });
                this.fileService.exists(targetNotationUri).then(exists => {
                    if (exists) {
                        this.openerService.getOpener(targetNotationUri).then(opener => opener.open(targetNotationUri));
                        return;
                    }
                    if (view.fileEnding === 'families') {
                        const notationURI = URI.fromComponents({
                            authority: workspaceRootUri.authority,
                            scheme: workspaceRootUri.scheme,
                            fragment: workspaceRootUri.fragment,
                            path: workspaceRootUri.path.toString() + '/../../families.notation', // TODO make this customizable
                            query: workspaceRootUri.query
                        });
                        this.fileService
                            .readFile(notationURI)
                            .then(contents => {
                                this.fileService
                                    .createFile(targetNotationUri, contents.value)
                                    .then(_ =>
                                        this.openerService.getOpener(targetNotationUri).then(opener => opener.open(targetNotationUri))
                                    );
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                });
                // const workspaceUriLength = this.workspaceService.getWorkspaceRootUri(finalURI)?.toString().length ?? 0;
                // const uriEncodedFileName = finalURI.toString().substring(workspaceUriLength + 1);
                // axios
                //     .get('http://localhost:8081/api/v2/register-view', {
                //         params: { modeluri: uriEncodedFileName, originalResourceURI: view.resourceURI, viewURI: view.id }
                //     })
                //     .then(data => {
                //         console.log('registration-success', data);
                //     })
                //     .catch(error => {
                //         console.log('registration-error', error);
                //     });
            }
        }
    };
}
