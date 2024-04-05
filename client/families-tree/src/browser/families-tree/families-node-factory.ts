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
import { ILogger } from '@theia/core';
import { inject, injectable } from 'inversify';
import { FamiliesModel } from './families-model';

import { FamiliesTreeEditorConstants } from './families-tree-editor-widget';
import { FamiliesTreeLabelProvider } from './families-tree-label-provider-contribution';

@injectable()
export class FamiliesTreeNodeFactory implements TreeEditor.NodeFactory {
    constructor(
        @inject(FamiliesTreeLabelProvider) private readonly labelProvider: FamiliesTreeLabelProvider,
        @inject(ILogger) private readonly logger: ILogger
    ) {}

    mapDataToNodes(treeData: TreeEditor.TreeData): TreeEditor.Node[] {
        const node = this.mapData(treeData.data);
        if (node) {
            return [node];
        }
        return [];
    }

    isObject(element: unknown): boolean {
        return typeof element === 'object' && element !== undefined;
    }
    mapData(
        element: { [key: string]: any },
        parent?: TreeEditor.Node,
        property?: string,
        indexOrKey?: number | string,
        defaultType?: string
    ): TreeEditor.Node {
        if (!element) {
            // sanity check
            this.logger.warn('mapData called without data');
            return {
                ...this.emptyNode(),
                editorId: FamiliesTreeEditorConstants.EDITOR_ID
            };
        }
        const node: TreeEditor.Node = {
            ...this.emptyNode(),
            editorId: FamiliesTreeEditorConstants.EDITOR_ID,
            name: this.labelProvider.getName(element) ?? '',
            parent: parent,
            id: element['id'] || element['$id'],
            jsonforms: {
                type: element['$type'] || defaultType || '',
                data: element,
                property: property ?? '',
                index: typeof indexOrKey === 'number' ? indexOrKey.toFixed(0) : indexOrKey
            }
        };
        // containments
        if (parent) {
            parent.children.push(node);
            parent.expanded = true;
        }
        // FIXME, type information from model server necessary
        Object.keys(element).forEach(elementKey => {
            const nextElement = element[elementKey];
            if (Array.isArray(nextElement) && nextElement.some(nextNextElement => this.isObject(nextNextElement))) {
                nextElement.forEach((nextNextElement, idx) => this.mapData(nextNextElement, node, elementKey, idx));
                return;
            }

            if (this.isObject(nextElement)) {
                this.mapData(nextElement, node, elementKey);
            }
        });

        // if (FamilyRegister.is(element) && element.families) {
        //     element.families.forEach((component: any, idx: number) => {
        //         this.mapData(component, node, 'families', idx);
        //     });
        // }
        // if (Family.is(element)) {
        //     node.jsonforms.data.$type = Family.$type;
        //     node.jsonforms.type = Family.$type;
        //     if (element.daughters) {
        //         element.daughters.forEach((component: any, idx: number) => {
        //             this.mapData(component, node, 'daughters', idx);
        //         });
        //     }
        //     if (element.sons) {
        //         element.sons.forEach((component: any, idx: number) => {
        //             this.mapData(component, node, 'sons', idx);
        //         });
        //     }
        //     if (element.father) {
        //         this.mapData(element.father, node, 'father', 0);
        //     }
        //     if (element.mother) {
        //         this.mapData(element.mother, node, 'mother', 0);
        //     }
        // }
        // if (Member.is(element)) {
        //     node.jsonforms.data.$type = Member.$type;

        //     node.jsonforms.type = Member.$type;
        // }
        return node;
    }

    hasCreatableChildren(node: TreeEditor.Node): boolean {
        return node ? FamiliesModel.childrenMapping.get(node.jsonforms.type) !== undefined : false;
    }

    protected emptyNode(): Pick<
        TreeEditor.Node,
        | 'children'
        | 'name'
        | 'jsonforms'
        | 'id'
        | 'icon'
        | 'description'
        | 'visible'
        | 'parent'
        | 'previousSibling'
        | 'nextSibling'
        | 'expanded'
        | 'selected'
        | 'focus'
        | 'decorationData'
    > {
        return {
            id: '',
            expanded: false,
            selected: false,
            parent: undefined,
            children: [],
            decorationData: {},
            name: '',
            jsonforms: { type: '', property: '', data: '' }
        };
    }
}
