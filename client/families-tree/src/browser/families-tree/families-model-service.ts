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
import { FamiliesModel } from './families-model';
import { TheiaModelServerClientV2 } from '@eclipse-emfcloud/modelserver-theia';

@injectable()
export class FamiliesModelService implements TreeEditor.ModelService {
    private typeSchema: {
        definitions: { [property: string]: JsonSchema7 };
    };
    constructor(
        @inject(ILogger) private readonly logger: ILogger,
        @inject(TheiaModelServerClientV2) protected readonly modelServerClient: TheiaModelServerClientV2
    ) {
        this.loadTypeSchema();
    }
    loadTypeSchema(): void {
        this.modelServerClient
            .getTypeSchema('families.families')
            .then(data => (this.typeSchema = JSON.parse(data)))
            .catch((error: any) => this.logger.error(error));
        return;
    }
    getDataForNode(node: TreeEditor.Node): void {
        return node.jsonforms.data;
    }
    getTypeSchema(): {
        definitions: { [property: string]: JsonSchema7 };
    } {
        return this.typeSchema;
    }

    async getSchemaForNode(node: TreeEditor.Node): Promise<JsonSchema7> {
        const definitions = await this.getTypeSchema();
        return {
            definitions: definitions.definitions,
            ...this.getSubSchemaForNode(node, definitions)
        };
    }

    private getSubSchemaForNode(node: TreeEditor.Node, definitions: { [key: string]: JsonSchema7 }): JsonSchema7 | undefined {
        const schema = this.getSchemaForType(node.jsonforms.type, definitions);
        if (!schema) {
            // If no schema can be found, let it generate by JsonForms:
            return undefined;
        }
        return schema;
    }

    private getSchemaForType(type: string, definitions: { [key: string]: JsonSchema7 }): JsonSchema7 | undefined {
        if (!type) {
            return undefined;
        }
        return (definitions ? Object.entries(definitions.definitions) : [])
            .map(entry => entry[1])
            .find((definition: JsonSchema7) => definition.properties && definition.properties.$type.const === type);
    }

    getUiSchemaForNode(node: TreeEditor.Node): UISchemaElement | undefined {
        return undefined;
        // const schema = this.getUiSchemaForType(node.jsonforms.type);
        // if (!schema) {
        //     // If no ui schema can be found, let it generate by JsonForms:
        //     return undefined;
        // }
        // return schema;
    }

    getChildrenMapping(): Map<string, TreeEditor.ChildrenDescriptor[]> {
        return FamiliesModel.childrenMapping;
    }

    getNameForType(type: string): string {
        return new URI(type).fragment.substring(2);
    }
}
