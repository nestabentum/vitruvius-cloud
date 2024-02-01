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
import { JsonSchema7, UISchemaElement } from '@jsonforms/core';
import { ILogger } from '@theia/core';
import { inject, injectable } from 'inversify';

import URI from '@theia/core/lib/common/uri';
import { FamiliesModel, FamilyRegister } from './families-model';
import { familiesSchema, familyRegisterView } from './families-schemas';

@injectable()
export class FamiliesModelService implements TreeEditor.ModelService {
    constructor(@inject(ILogger) private readonly logger: ILogger) {}

    getDataForNode(node: TreeEditor.Node): void {
        return node.jsonforms.data;
    }

    getSchemaForNode(node: TreeEditor.Node): JsonSchema7 {
        return {
            definitions: familiesSchema.definitions,
            ...this.getSubSchemaForNode(node)
        };
    }

    private getSubSchemaForNode(node: TreeEditor.Node): JsonSchema7 | undefined {
        const schema = this.getSchemaForType(node.jsonforms.type);
        if (!schema) {
            // If no schema can be found, let it generate by JsonForms:
            return undefined;
        }
        return schema;
    }

    private getSchemaForType(type: string): JsonSchema7 | undefined {
        if (!type) {
            return undefined;
        }
        return (familiesSchema.definitions ? Object.entries(familiesSchema.definitions) : [])
            .map(entry => entry[1])
            .find((definition: JsonSchema7) => definition.properties && definition.properties.$type.const === type);
    }

    getUiSchemaForNode(node: TreeEditor.Node): UISchemaElement | undefined {
        const schema = this.getUiSchemaForType(node.jsonforms.type);
        if (!schema) {
            // If no ui schema can be found, let it generate by JsonForms:
            return undefined;
        }
        return schema;
    }

    private getUiSchemaForType(type: string): UISchemaElement | undefined {
        if (!type) {
            return undefined;
        }
        switch (type) {
            case FamilyRegister.$type:
                return familyRegisterView;

            default:
                this.logger.warn("Can't find registered ui schema for type " + type);
                return undefined;
        }
    }

    getChildrenMapping(): Map<string, TreeEditor.ChildrenDescriptor[]> {
        return FamiliesModel.childrenMapping;
    }

    getNameForType(type: string): string {
        return new URI(type).fragment.substring(2);
    }
}
