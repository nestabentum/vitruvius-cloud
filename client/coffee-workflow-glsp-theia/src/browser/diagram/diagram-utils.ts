/*
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
import URI from '@theia/core/lib/common/uri';

const treeFileExtension = '.tree'; // TODO families
const notationFileExtension = '.notation'; // TODO families-notation

export function getUriString(uriString: string): string {
    if (uriString.endsWith(notationFileExtension)) {
        return uriString.replace(notationFileExtension, treeFileExtension);
    } else if (uriString.endsWith(treeFileExtension)) {
        return uriString;
    }
    throw Error(`Unexpected uriString: ${uriString}! Expected uriString ending in ${treeFileExtension} or ${notationFileExtension}!`);
}

export function getUri(uri: URI): URI {
    const uriString = uri.toString();
    const coffeeString = getUriString(uriString);
    return new URI(coffeeString);
}

export function getNotationUriString(uriString: string): string {
    if (uriString.endsWith(treeFileExtension)) {
        return uriString.replace(treeFileExtension, notationFileExtension);
    } else if (uriString.endsWith(notationFileExtension)) {
        return uriString;
    }
    throw Error(`Unexpected uriString: ${uriString}! Expected uriString ending in ${treeFileExtension} or ${notationFileExtension}!`);
}

export function getNotationUri(uri: URI): URI {
    const uriString = uri.toString();
    const notationString = getNotationUriString(uriString);
    return new URI(notationString);
}
