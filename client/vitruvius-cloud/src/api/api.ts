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

const baseUrl = 'http://localhost:8069/vsum/';
export function getViewTypes(): Promise<AxiosResponse<ViewTypes>> {
    return axios.get<ViewTypes>(`${baseUrl}view/types`);
}

export async function getView(viewType: string, logger: ILogger): Promise<void> {
    let ids: string[] = [];
    let selectorID: string = '';
    await axios
        .get(`${baseUrl}view/selector`, {
            headers: {
                'View-Type': viewType
            }
        })
        .then(data => {
            selectorID = data.headers['selector-uuid'];
            ids = data.data.map((elem: any) => elem._id);
        })
        .catch(error => logger.error(error));

    return await axios
        .post(`${baseUrl}view`, ids, {
            headers: {
                'Selector-UUID': selectorID
            }
        })
        .then(response => {
            console.log(response.data)
        })
        .catch(error => logger.error(error));
}
export type ViewTypes = string[];
