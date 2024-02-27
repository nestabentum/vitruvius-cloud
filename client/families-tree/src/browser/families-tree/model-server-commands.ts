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
import { ModelServerCommand } from '@eclipse-emfcloud/modelserver-client';

export namespace CommandUtil {
    export const SEMANTIC_ELEMENT_ID = 'semanticElementId';
    export const POSITION_X = 'positionX';
    export const POSITION_Y = 'positionY';
}

export namespace AddAutomatedTaskCommandContribution {
    export const TYPE = 'addAutomatedTaskContribution';

    export function create(): ModelServerCommand {
        const addCommand = new ModelServerCommand(TYPE);
        addCommand.setProperty(CommandUtil.POSITION_X, '0.0');
        addCommand.setProperty(CommandUtil.POSITION_Y, '0.0');
        return addCommand;
    }
}

export namespace AddFamilyContribution {
    export const TYPE = 'addFamilyContribution';

    export function create(): ModelServerCommand {
        return new ModelServerCommand(TYPE, { viewSerial: 'serial-123-abc' });
    }
}
