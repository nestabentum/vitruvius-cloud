/*
 * Copyright (c) 2019-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
import { injectable, inject } from '@theia/core/shared/inversify';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { NavigatableTreeEditorOptions } from '@eclipse-emfcloud/theia-tree-editor';
@injectable()
export class Utils {
    constructor(
        @inject(WorkspaceService) readonly workspaceService: WorkspaceService,
        @inject(NavigatableTreeEditorOptions) protected readonly options: NavigatableTreeEditorOptions
    ) {}
    public getModelID(): string {
        const rootUriLength = this.workspaceService.getWorkspaceRootUri(this.options.uri)?.toString().length ?? 0;
        const id = this.options.uri.toString().substring(rootUriLength + 1);
        return id;
    }
}
