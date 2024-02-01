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
import { FamiliesModel, FamilyRegister, Family, Identifiable } from './families-model';

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

    mapData(
        element: Identifiable,
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
            id: element.id,
            jsonforms: {
                type: element.$type || defaultType || '',
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

        if (FamilyRegister.is(element) && element.families) {
            element.families.forEach((component: any, idx: number) => {
                this.mapData(component, node, 'families', idx);
            });
        }
        if (Family.is(element)) {
            if (element.daughters) {
                element.daughters.forEach((component: any, idx: number) => {
                    this.mapData(component, node, 'daughters', idx);
                });
            }
            if (element.sons) {
                element.sons.forEach((component: any, idx: number) => {
                    this.mapData(component, node, 'sons', idx);
                });
            }
        }
        // if (Component.is(element) && element.children) {
        //     element.children.forEach((component: any, idx: number) => {
        //         this.mapData(component, node, 'children', idx);
        //     });
        // }
        // if (Machine.is(element)) {
        //     element.workflows.forEach((workflow: any, idx: number) => {
        //         workflow.$type = Workflow.$type;
        //         this.mapData(workflow, node, 'workflows', idx);
        //     });
        // }
        // if (Workflow.is(element)) {
        //     if (element.nodes) {
        //         element.nodes.forEach((workflowNode: any, idx: number) => {
        //             this.mapData(workflowNode, node, 'nodes', idx);
        //         });
        //     }
        //     if (element.flows) {
        //         element.flows.forEach((flow: any, idx: number) => {
        //             if (!WeightedFlow.is(flow)) {
        //                 flow.$type = Flow.$type;
        //             }
        //             this.mapData(flow, node, 'flows', idx);
        //         });
        //     }
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
