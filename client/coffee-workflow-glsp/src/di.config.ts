/*
 * Copyright (c) 2019-2023 EclipseSource, Christian W. Damus, and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
import 'balloon-css/balloon.min.css';
import 'sprotty/css/edit-label.css';
import '../css/diagram.css';

import {
    configureDefaultModelElements,
    configureModelElement,
    ConsoleLogger,
    createDiagramContainer,
    DeleteElementContextMenuItemProvider,
    editLabelFeature,
    GEdgeView,
    GridSnapper,
    LogLevel,
    overrideViewerOptions,
    RectangularNode,
    RevealNamedElementActionProvider,
    RoundedCornerNodeView,
    SEdge,
    SLabel,
    SLabelView,
    TYPES
} from '@eclipse-glsp/client';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { Container, ContainerModule } from 'inversify';

import { directTaskEditor } from './direct-task-editing/di.config';

const workflowDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    bind(TYPES.ISnapper).to(GridSnapper);
    bind(TYPES.ICommandPaletteActionProvider).to(RevealNamedElementActionProvider);
    bind(TYPES.IContextMenuItemProvider).to(DeleteElementContextMenuItemProvider);
    const context = { bind, unbind, isBound, rebind };

    configureDefaultModelElements(context);
    configureModelElement(context, 'person:male', RectangularNode, RoundedCornerNodeView);
    configureModelElement(context, 'daughter', RectangularNode, RoundedCornerNodeView);

    configureModelElement(context, 'label:heading', SLabel, SLabelView, { enable: [editLabelFeature] });

    configureModelElement(context, DefaultTypes.EDGE, SEdge, GEdgeView);
});

export default function createContainer(widgetId: string): Container {
    const container = createDiagramContainer(workflowDiagramModule, directTaskEditor);
    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    });
    return container;
}
