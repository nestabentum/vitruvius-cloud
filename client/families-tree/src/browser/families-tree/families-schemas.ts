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
import { JsonSchema7 } from '@jsonforms/core';

export const familyRegisterView = {
    type: 'HorizontalLayout',
    elements: [
        { type: 'Label', text: 'Familie' },
        {
            type: ' Control',
            label: 'ID',
            scope: '#/properties/title'
        }
    ]
};
export const familiesSchema: JsonSchema7 = {
    definitions: {
        familyRegister: {
            $id: '#familyregister',
            title: 'FamilyRegister',
            type: 'object',
            properties: {
                $id: {
                    type: 'string'
                }
            }
        },
        family: {
            title: 'Family',
            properties: {
              typeId: {
                const: 'MyComponent'
              },
              name: {
                type: 'string',
                minLength: 3,
                maxLength: 20
              },
              active: {
                type: 'string',
                enum: [
                  'yes',
                  'no'
                ]
              }
            },
            required: [ 'name' ],
            additionalProperties: false
        }
    },
    $ref: '#/definitions/families'
};
