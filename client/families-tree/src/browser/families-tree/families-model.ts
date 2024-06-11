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
import { AnyObject, isArray, isString, ModelServerObjectV2 } from '@eclipse-emfcloud/modelserver-client';
import { TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';

export type JsonPrimitiveType = string | boolean | number | object;
export namespace JsonPrimitiveType {
    export function is(object: unknown): object is JsonPrimitiveType {
        return (
            object !== undefined &&
            (typeof object === 'string' || typeof object === 'boolean' || typeof object === 'number' || typeof object === 'object')
        );
    }
}

export interface Identifiable extends ModelServerObjectV2, AnyObject {
    id: string;
}

export namespace Identifiable {
    export function is(object: unknown): object is Identifiable {
        return (
            AnyObject.is(object) && (isString(object, '$id') || isString(object, 'id'))
            // && isString(object, 'id')
        );
    }
}
const $familiesTypeBase = 'edu.kit.ipd.sdq.metamodels.families#//';
const $personTypeBase = 'edu.kit.ipd.sdq.metamodels.persons#//';

export interface Family extends Identifiable {
    daughters?: Son[];
    sons?: Daughter[]; // use member type
    father?: Member;
    mother?: Member;
    lastName: string;
}
export interface Member extends Identifiable {
    firstName: string;
}
export namespace Member {
    export const $type = `${$familiesTypeBase}Member`;
    export function is(object: unknown): object is Member {
        return Identifiable.is(object) && isString(object, 'firstName');
    }
}
export interface Son extends Member {}
export interface Daughter extends Member {}

export namespace Family {
    export const $type = `${$familiesTypeBase}Family`;
    export function is(object: unknown): object is Family {
        return Identifiable.is(object) && (isString(object, 'lastName') || isArray(object, 'daughters') || isArray(object, 'sons'));
    }
}

export interface FamilyRegister extends Identifiable {
    families?: Family[];
}
export interface Male extends Identifiable {
    fullName?: string;
}
export interface Female extends Identifiable {
    fullName?: string;
}
export namespace FamilyRegister {
    export const $type = `${$familiesTypeBase}FamilyRegister`;
    export function is(object: unknown): object is FamilyRegister {
        return Identifiable.is(object) && $type === object.$type;
    }
}
export namespace PersonRegister {
    export const $type = `${$personTypeBase}PersonRegister`;

}
export namespace Male {
    export const $type = `${$personTypeBase}Male`;

    export function is(object: unknown): object is Male {
        return Identifiable.is(object) && (isString(object, 'fullName') )  && object.$type === $type;
    }

}
export namespace Female {
    export const $type = `${$personTypeBase}Female`;
    export function is(object: unknown): object is Female {
        return Identifiable.is(object) && (isString(object, 'fullName') )  && object.$type === $type;
    }

}
export namespace FamiliesModel {
    export const childrenMapping: Map<string, TreeEditor.ChildrenDescriptor[]> = new Map([
        [FamilyRegister.$type, [{ property: 'families', children: [Family.$type] }]],
        [
            Family.$type,
            [
                { property: 'daughters', children: [Member.$type] },
                { property: 'sons', children: [Member.$type] },
                { property: 'father', children: [Member.$type] },
                { property: 'mother', children: [Member.$type] }
            ]
        ]
    ]);
}

export namespace PersonsModel {
    export const childrenMapping: Map<string, TreeEditor.ChildrenDescriptor[]> = new Map([
        [
            PersonRegister.$type,
            [
                {
                    property: 'persons',
                    children: [Male.$type, Female.$type]
                }
            ]
        ]
    ]);
}
