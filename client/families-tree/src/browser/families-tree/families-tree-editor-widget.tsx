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
import {
    AnyObject,
    DirtyStateNotification,
    IncrementalUpdateNotificationV2,
    isString,
    Operations,
    PatchOrCommand
} from '@eclipse-emfcloud/modelserver-client';
import { TheiaModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia';
import { ModelServerSubscriptionServiceV2 } from '@eclipse-emfcloud/modelserver-theia/lib/browser';
import {
    AddCommandProperty,
    BaseTreeEditorWidget,
    DetailFormWidget,
    NavigatableTreeEditorOptions,
    NavigatableTreeEditorWidget,
    TreeEditor
} from '@eclipse-emfcloud/theia-tree-editor';
import { Title, Widget } from '@theia/core/lib/browser';
import { ILogger } from '@theia/core/lib/common';
import URI from '@theia/core/lib/common/uri';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { compare, Operation } from 'fast-json-patch';
import { inject, injectable } from 'inversify';
import { isEqual } from 'lodash';
import { FamiliesMasterTreeWidget } from './families-master-tree-widget';

import { FamilyRegister, Identifiable, JsonPrimitiveType } from './families-model';
import { AddFatherContribution } from './model-server-commands';
import { ViewIdCache } from 'vitruvius-cloud-extension/lib/ViewIdCache';
import { Utils } from '../utils';

@injectable()
export class FamiliesTreeEditorWidget extends NavigatableTreeEditorWidget {
    protected override instanceData: FamilyRegister | undefined;
    private delayedRefresh = false;

    constructor(
        @inject(FamiliesMasterTreeWidget) override readonly treeWidget: FamiliesMasterTreeWidget,
        @inject(DetailFormWidget) override readonly formWidget: DetailFormWidget,
        @inject(WorkspaceService) override readonly workspaceService: WorkspaceService,
        @inject(ILogger) override readonly logger: ILogger,
        @inject(NavigatableTreeEditorOptions) protected override readonly options: NavigatableTreeEditorOptions,
        @inject(TheiaModelServerClientV2) protected readonly modelServerClient: TheiaModelServerClientV2,
        @inject(ModelServerSubscriptionServiceV2) protected readonly subscriptionService: ModelServerSubscriptionServiceV2,
        @inject(Utils) private readonly utils: Utils
    ) {
        super(treeWidget, formWidget, workspaceService, logger, FamiliesTreeEditorConstants.WIDGET_ID, options);

        this.subscriptionService.onDirtyStateListener((notification: DirtyStateNotification) => {
            this.dirty = notification.isDirty;
            this.onDirtyChangedEmitter.fire();
        });
        this.subscriptionService.onIncrementalUpdateListenerV2((incrementalUpdate: IncrementalUpdateNotificationV2) =>
            this.updateWidgetData(incrementalUpdate)
        );
        this.loadModel();

        this.modelServerClient.subscribe(this.utils.getModelID());

        // see https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
        window.onbeforeunload = () => this.dispose();
    }

    private loadModel(initialLoad = true): void {
        this.modelServerClient
            // .get<Machine>(this.utils.getModelID(), Machine.is, 'json-v2') // FIXME - sends format as format=%7B%7D ???
            .get(this.utils.getModelID())
            .then(machineModel => {
                if (isEqual(this.instanceData, machineModel)) {
                    return;
                }
                this.instanceData = undefined;
                this.instanceData = machineModel as FamilyRegister;
                this.treeWidget
                    .setData({ error: false, data: this.instanceData })
                    .then(() => (initialLoad ? this.treeWidget.selectFirst() : this.treeWidget.select(this.getOldSelectedPath())));
                this.update();
                return;
            })
            .catch(() => {
                this.treeWidget.setData({ error: true });
                this.renderError(`An error occurred when requesting Machine Model '${this.utils.getModelID()}'`);
                this.instanceData = undefined;
                return;
            });
    }

    protected updateWidgetData(incrementalUpdate: IncrementalUpdateNotificationV2): void {
        if (Operations.isPatch(incrementalUpdate.patch)) {
            if (this.instanceData) {
                incrementalUpdate.patchModel(this.instanceData);
                this.treeWidget.setData({ error: false, data: this.instanceData }).then(() => {
                    const selectPath = this.getOldSelectedPath();
                    if (this.selectedNode.id !== selectPath[0]) {
                        this.treeWidget.select(selectPath);
                    }
                });
                this.update();
            }
        }
    }

    private getOldSelectedPath(): string[] {
        const paths: string[] = [];
        if (!this.selectedNode) {
            return paths;
        }
        paths.push(this.selectedNode.id);
        let parent = this.selectedNode.parent;
        while (parent) {
            if (parent.id) {
                paths.push(parent.id);
            }
            parent = parent.parent;
        }
        paths.splice(paths.length - 1, 1);
        return paths;
    }

    protected getRelativeModelUri(sourceUri: string): string {
        const workspaceUri = this.workspaceService.getWorkspaceRootUri(new URI(sourceUri));
        if (workspaceUri) {
            const workspaceString = workspaceUri.toString().replace('file://', '');
            const rootUriLength = workspaceString.length;
            return sourceUri.substring(rootUriLength + 1);
        }
        return '';
    }

    protected isCurrentModelUri(uri: URI): boolean {
        return uri.path.toString() === '/' + this.utils.getModelID();
    }

    override save(): void {
        this.modelServerClient.save(this.utils.getModelID());
    }

    protected async deleteNode(node: Readonly<TreeEditor.Node>): Promise<void> {
        const data = node.jsonforms.data;
        // if (ManualTask.is(data) || AutomaticTask.is(data) || Decision.is(data) || Merge.is(data)) {
        //     patchOrCommand = RemoveNodeCommandContribution.create(data.id);
        // } else if (Flow.is(data)) {
        //     patchOrCommand = RemoveFlowCommandContribution.create(data.id);
        // } else {
        const patchOrCommand: PatchOrCommand = {
            op: 'remove',
            path: this.getOperationPath(data.$id)
        };
        // }
        this.modelServerClient.edit(this.utils.getModelID(), patchOrCommand);
    }

    private getViewSerial = (): string => ViewIdCache.getViewId(this.utils.getModelID());

    protected async addNode({ node, type, property }: AddCommandProperty): Promise<void> {
        console.log('adding a node', node, type, property);
        let patchOrCommand: PatchOrCommand;
        // if (type === Family.$type) {
        //     patchOrCommand = AddFamilyContribution.create(this.getViewSerial());
        // } else
        
        if (property ==='father') {
            patchOrCommand = AddFatherContribution.create('Father', this.getViewSerial());
        } else {
            patchOrCommand = {
                op: 'add',
                path: this.getOperationPath(node.id, property),
                value: { $type: type }
            };
        }

        this.modelServerClient.edit(this.utils.getModelID(), patchOrCommand);
    }

    override dispose(): void {
        this.modelServerClient.unsubscribe(this.utils.getModelID());
        super.dispose();
    }

    protected async handleFormUpdate(jsonFormsData: any, _node: TreeEditor.Node): Promise<void> {
        if (jsonFormsData.id === this.selectedNode.jsonforms.data.id && !isEqual(jsonFormsData, this.selectedNode.jsonforms.data)) {
            const resultDiff = this.getDiffPatch(compare(this.selectedNode.jsonforms.data, jsonFormsData));
            const editPatch = this.createDiffPatch(resultDiff, jsonFormsData, this.selectedNode.jsonforms.data);
            if (editPatch) {
                this.modelServerClient.edit(this.utils.getModelID(), editPatch);
            }
        }
    }

    protected getOperationPath(changedObjectId: string, feature?: string): string {
        return `${this.utils.getModelID()}#${changedObjectId}${feature ? '/' + feature : ''}`;
    }

    protected getDiffPatch(compareResult: Operation[]): Operation {
        if (compareResult.length === 1) {
            return compareResult[0];
        }
        // Do filter patches for changed ids which might be results from array changes
        const filteredResults = compareResult.filter(result => !(result.path.endsWith('$id') || result.path.endsWith('id')));
        return filteredResults[0];
    }

    protected createDiffPatch(
        diffPatch: Operation,
        changedObject: Identifiable,
        oldObject: Identifiable
    ): Operation | Operation[] | undefined {
        switch (diffPatch.op) {
            case 'replace': {
                // unset values if input was cleared
                if (
                    // eslint-disable-next-line no-null/no-null
                    diffPatch.value === null ||
                    (typeof diffPatch.value === 'number' && isNaN(diffPatch.value as number))
                ) {
                    return {
                        op: 'remove',
                        path: this.getOperationPath(
                            this.getOwnerIdByPath(diffPatch.path, changedObject, oldObject, 'remove'),
                            this.getFeature(diffPatch.path)
                        )
                    };
                } else {
                    const feature = this.getFeature(diffPatch.path, !!diffPatch.path.match(/^\/ram(\/\d+)?/gm));
                    return {
                        op: diffPatch.op,
                        path: this.getOperationPath(this.getOwnerIdByPath(diffPatch.path, changedObject, oldObject, diffPatch.op), feature),
                        value: this.getAddValue(diffPatch.value, feature)
                    };
                }
            }
            case 'add': {
                const feature = this.getFeature(diffPatch.path, !!diffPatch.path.match(/^\/ram(\/\d+)?/gm));
                return {
                    op: diffPatch.op,
                    path: this.getOperationPath(this.getOwnerIdByPath(diffPatch.path, changedObject, oldObject, diffPatch.op), feature),
                    value: this.getAddValue(diffPatch.value, feature)
                };
            }
            case 'remove': {
                // remove ram entries from array
                return {
                    op: diffPatch.op,
                    path: this.getOperationPath(this.getOwnerIdByPath(diffPatch.path, changedObject, oldObject, diffPatch.op))
                };
            }
            default: {
                console.error('unknown diffPatch operation');
                return undefined;
            }
        }
    }

    protected getFeature(patchPath: string, addFeature = false): string {
        if (addFeature) {
            const segments = patchPath.split('/').slice(1);
            return segments.length > 1 ? segments.slice(0, -1)[0] : segments[0];
        }
        return patchPath.split('/').reverse()[0];
    }

    protected getOwnerIdByPath(
        path: string,
        jsonFormsData: Identifiable,
        oldData: Identifiable,
        operation: 'add' | 'remove' | 'replace'
    ): string {
        // remove first ('') redundant segment
        let pathSegments = path.split('/').slice(1);
        if (pathSegments.length === 1) {
            return oldData.id;
        }
        if (pathSegments.length > 1) {
            // remove and last segment for array paths (last segment is the feature)
            pathSegments = pathSegments.slice(0, -1);
        }
        let id = '';
        let parentObject = oldData; // jsonFormsData?
        pathSegments.forEach(segment => {
            if (!Number.isNaN(Number(segment))) {
                parentObject = parentObject[Number(segment)] as Identifiable;
                if (AnyObject.is(parentObject) && isString(parentObject, 'id')) {
                    id = parentObject.id as string;
                }
            } else if (typeof segment === 'string') {
                parentObject = parentObject[segment] as Identifiable;
                if (AnyObject.is(parentObject) && isString(parentObject, 'id')) {
                    id = parentObject.id as string;
                }
            }
        });
        // FIXME special case remove ram
        // if (id === '' && pathSegments[0] === 'ram' && ControlUnit.is(oldData) && oldData.ram) {
        //     if (operation === 'remove') {
        //         id = oldData.ram[0].id;
        //     } else {
        //         id = oldData.id;
        //     }
        // }
        return id;
    }

    protected getAddValue(value: any, feature: string): JsonPrimitiveType {
        // if (feature === 'ram') {
        //     return { $type: RAM.$type, id: UUID.uuid4() };
        // } else if (feature === 'processor') {
        //     return { $type: Processor.$type, id: UUID.uuid4(), ...value };
        // } else if (feature === 'dimension') {
        //     return { $type: Dimension.$type, id: UUID.uuid4(), ...value };
        // } else if (feature === 'display') {
        //     return { $type: Display.$type, id: UUID.uuid4(), ...value };
        // }
        return value;
    }

    protected isEmptyObject(object: AnyObject): boolean {
        return Object.keys(object).length === 0;
    }

    protected isChangeableFeature(featureName: string, changedObject: object): boolean {
        const changeableFeatures = Object.keys(changedObject).filter(
            key => key !== '$type' && key !== '$id' && key !== 'id' && key !== 'source' && key !== 'target' && key !== 'components'
        );
        return changeableFeatures.indexOf(featureName) > -1;
    }

    protected override configureTitle(title: Title<Widget>): void {
        title.label = this.options.uri.path.base;
        title.caption = BaseTreeEditorWidget.WIDGET_LABEL;
        title.closable = true;
        title.iconClass = 'codicon coffee-icon dark-purple';
    }

    override show(): void {
        super.show();
        if (this.delayedRefresh) {
            this.delayedRefresh = false;
            this.treeWidget.model.refresh();
        }
    }
}
export namespace FamiliesTreeEditorConstants {
    export const WIDGET_ID = 'json-forms-tree-editor';
    export const EDITOR_ID = 'org.eclipse.emfcloud.families.editor';
}
