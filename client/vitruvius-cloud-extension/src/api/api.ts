// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0

import { ILogger } from '@theia/core';
import axios, { AxiosResponse } from 'axios';

const vitruvServerUrl = 'http://localhost:8069/vsum/';
const vitruvAdapterUrl = 'http://localhost:8070/vsum/';

export function getViewTypes(): Promise<AxiosResponse<ViewTypes>> {
    return axios.get<ViewTypes>(`${vitruvServerUrl}view/types`);
}

export function getView(viewType: string, logger: ILogger): Promise<{ fileEnding: string; id: string; view: string, resourceURI: string }> {
    return axios
        .post(
            `${vitruvAdapterUrl}view/`,
            {},
            {
                headers: {
                    'View-Type': viewType
                }
            }
        )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            logger.error(error);
        });
}
export type ViewTypes = string[];
