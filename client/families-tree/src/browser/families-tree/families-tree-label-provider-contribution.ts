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
import { TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';
import { codicon, LabelProviderContribution } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { injectable } from 'inversify';

import { Family, FamilyRegister, Member } from './families-model';
import { FamiliesTreeEditorConstants } from './families-tree-editor-widget';

const ICON_CLASSES: Map<string, string> = new Map([[FamilyRegister.$type, 'settings-gear']]);

/* Icon for unknown types */
const UNKNOWN_ICON = 'circle-slash';

@injectable()
export class FamiliesTreeLabelProvider implements LabelProviderContribution {
    public canHandle(element: object): number {
        if (
            (TreeEditor.Node.is(element) || TreeEditor.CommandIconInfo.is(element)) &&
            element.editorId === FamiliesTreeEditorConstants.EDITOR_ID
        ) {
            return 1000;
        }
        return 0;
    }

    public getIcon(element: object): string | undefined {
        let iconClass: string | undefined;
        if (TreeEditor.CommandIconInfo.is(element)) {
            iconClass = ICON_CLASSES.get(element.type);
        } else if (TreeEditor.Node.is(element)) {
            iconClass = ICON_CLASSES.get(element.jsonforms.type);
        }

        return iconClass ? codicon(iconClass) : codicon(UNKNOWN_ICON);
    }

    public getName(element: object): string | undefined {
        const data = TreeEditor.Node.is(element) ? element.jsonforms.data : element;

        if (Family.is(data)) {
            return 'Family ' + data.lastName;
        } else if (Member.is(data)) {
            return 'Member ' + data.firstName;
        }
        return this.getNameForType(data.$type);
    }

    private getNameForType(type: string): string {
        return new URI(type).fragment.substring(2);
    }
}
