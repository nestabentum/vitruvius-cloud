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
import '@eclipse-emfcloud/theia-tree-editor/style/forms.css';
import '@eclipse-emfcloud/theia-tree-editor/style/index.css';
import '../../css/families-tree-editor.css';

import {
    BaseTreeEditorWidget,
    DetailFormWidget,
    NavigatableTreeEditorOptions,
    TREE_PROPS,
    TreeEditor
} from '@eclipse-emfcloud/theia-tree-editor';
import { CommandContribution, MenuContribution } from '@theia/core';
import {
    LabelProviderContribution,
    NavigatableWidgetOptions,
    OpenHandler,
    WidgetFactory,
    createTreeContainer
} from '@theia/core/lib/browser';
import { TreeWidget as TheiaTreeWidget, TreeProps } from '@theia/core/lib/browser/tree';
import URI from '@theia/core/lib/common/uri';
import { ContainerModule } from 'inversify';
import { interfaces } from '@theia/core/shared/inversify';
import { FamiliesTreeEditorContribution } from './families-editor-tree-contribution';
import { FamiliesLabelProviderContribution } from './families-tree-label-provider';
import { FamiliesMasterTreeWidget } from './families-tree/families-master-tree-widget';
import { FamiliesModelService } from './families-tree/families-model-service';
import { FamiliesTreeNodeFactory } from './families-tree/families-node-factory';
import { FamiliesTreeEditorConstants, FamiliesTreeEditorWidget } from './families-tree/families-tree-editor-widget';
import { FamiliesTreeLabelProvider } from './families-tree/families-tree-label-provider-contribution';

import {
    ModelServerSubscriptionClient,
    ModelServerSubscriptionClientV2,
    ModelServerSubscriptionServiceV2
} from '@eclipse-emfcloud/modelserver-theia/lib/browser';
import { Utils } from './utils';
export default new ContainerModule((bind, _unbind, isBound, rebind) => {
    // Bind ModelServerSubscription services
    bind(ModelServerSubscriptionClientV2).toSelf().inSingletonScope();
    bind(ModelServerSubscriptionServiceV2).toService(ModelServerSubscriptionClientV2);
    if (isBound(ModelServerSubscriptionClient)) {
        rebind(ModelServerSubscriptionClient).toService(ModelServerSubscriptionClientV2);
    } else {
        bind(ModelServerSubscriptionClient).toService(ModelServerSubscriptionClientV2);
    }

    // Bind Theia IDE contributions
    console.log('registering families tree editor');
    bind(LabelProviderContribution).to(FamiliesLabelProviderContribution);
    bind(OpenHandler).to(FamiliesTreeEditorContribution);
    bind(MenuContribution).to(FamiliesTreeEditorContribution);
    bind(CommandContribution).to(FamiliesTreeEditorContribution);
    bind(LabelProviderContribution).to(FamiliesTreeLabelProvider);

    // bind to themselves because we use it outside of the editor widget, too.
    bind(Utils).toSelf()
    bind(FamiliesModelService).toSelf().inSingletonScope();
    bind(FamiliesTreeLabelProvider).toSelf().inSingletonScope();

    bind<WidgetFactory>(WidgetFactory).toDynamicValue(context => ({
        id: FamiliesTreeEditorConstants.WIDGET_ID,
        createWidget: (options: NavigatableWidgetOptions) => {
            const treeContainer = createBasicTreeContainer(
                context.container,
                FamiliesTreeEditorWidget,
                FamiliesModelService,
                FamiliesTreeNodeFactory
            );

            // Bind options
            const uri = new URI(options.uri);
            treeContainer.bind(NavigatableTreeEditorOptions).toConstantValue({ uri });

            return treeContainer.get(FamiliesTreeEditorWidget);
        }
    }));
});

function createTreeWidget(parent: interfaces.Container): FamiliesMasterTreeWidget {
    const treeContainer = createTreeContainer(parent);

    treeContainer.unbind(TheiaTreeWidget);
    treeContainer.bind(FamiliesMasterTreeWidget).toSelf();
    treeContainer.rebind(TreeProps).toConstantValue(TREE_PROPS);
    return treeContainer.get(FamiliesMasterTreeWidget);
}

export function createBasicTreeContainer(
    parent: interfaces.Container,
    treeEditorWidget: interfaces.Newable<BaseTreeEditorWidget>,
    modelService: interfaces.Newable<TreeEditor.ModelService>,
    nodeFactory: interfaces.Newable<TreeEditor.NodeFactory>
): interfaces.Container {
    const container = parent.createChild();
    container.bind(TreeEditor.ModelService).to(modelService);
    container.bind(TreeEditor.NodeFactory).to(nodeFactory);
    container.bind(DetailFormWidget).toSelf();
    container.bind(FamiliesMasterTreeWidget).toDynamicValue(context => createTreeWidget(context.container));
    container.bind(treeEditorWidget).toSelf();

    return container;
}
