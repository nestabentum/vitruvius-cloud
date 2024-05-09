/*
 * Copyright (c) 2019-2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
import { BaseTreeEditorContribution, BaseTreeEditorWidget, TreeContextMenu, TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';
import { CommandRegistry, MenuModelRegistry } from '@theia/core';
import { NavigatableWidgetOptions, OpenerService, WidgetOpenerOptions } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { inject, injectable } from 'inversify';

import { FamiliesModelService } from './families-tree/families-model-service';
import { CoffeeTreeCommands, OpenWorkflowDiagramCommandHandler } from './families-tree/families-tree-container';
import { FamiliesTreeEditorConstants } from './families-tree/families-tree-editor-widget';
import { FamiliesTreeLabelProvider } from './families-tree/families-tree-label-provider-contribution';

@injectable()
export class FamiliesTreeEditorContribution extends BaseTreeEditorContribution {
    @inject(OpenerService) protected opener: OpenerService;

    constructor(
        @inject(FamiliesModelService) modelService: TreeEditor.ModelService,
        @inject(FamiliesTreeLabelProvider) labelProvider: FamiliesTreeLabelProvider
    ) {
        super(FamiliesTreeEditorConstants.EDITOR_ID, modelService, labelProvider);
    }

    readonly id = FamiliesTreeEditorConstants.WIDGET_ID;
    readonly label = BaseTreeEditorWidget.WIDGET_LABEL;

    canHandle(uri: URI): number {
        if (uri.path.ext === '.tree') {
            return 1000;
        }
        return 0;
    }

    override registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(CoffeeTreeCommands.OPEN_WORKFLOW_DIAGRAM, new OpenWorkflowDiagramCommandHandler(this.shell, this.opener));

        super.registerCommands(commands);
    }

    override registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(TreeContextMenu.CONTEXT_MENU, {
            commandId: CoffeeTreeCommands.OPEN_WORKFLOW_DIAGRAM.id,
            label: CoffeeTreeCommands.OPEN_WORKFLOW_DIAGRAM.label
        });

        super.registerMenus(menus);
    }

    protected createWidgetOptions(uri: URI, options?: WidgetOpenerOptions): NavigatableWidgetOptions {
        return {
            kind: 'navigatable',
            uri: this.serializeUri(uri)
        };
    }

    protected serializeUri(uri: URI): string {
        return uri.withoutFragment().toString();
    }
}
