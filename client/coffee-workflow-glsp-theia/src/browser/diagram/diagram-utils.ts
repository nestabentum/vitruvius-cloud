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

const personsileExtension = '.persons'; // TODO families
const notationFileExtension = '.notation'; // TODO families-notation

export function getCoffeeUriString(uriString: string): string {
    if (uriString.endsWith(notationFileExtension)) {
        return uriString.replace(notationFileExtension, personsileExtension);
    } else if (uriString.endsWith(personsileExtension)) {
        return uriString;
    }
    throw Error(`Unexpected uriString: ${uriString}! Expected uriString ending in ${personsileExtension} or ${notationFileExtension}!`);
}

export function getCoffeeUri(uri: URI): URI {
    const uriString = uri.toString();
    const coffeeString = getCoffeeUriString(uriString);
    return new URI(coffeeString);
}

export function getNotationUriString(uriString: string): string {
    if (uriString.endsWith(personsileExtension)) {
        return uriString.replace(personsileExtension, notationFileExtension);
    } else if (uriString.endsWith(notationFileExtension)) {
        return uriString;
    }
    throw Error(`Unexpected uriString: ${uriString}! Expected uriString ending in ${personsileExtension} or ${notationFileExtension}!`);
}

export function getNotationUri(uri: URI): URI {
    const uriString = uri.toString();
    const notationString = getNotationUriString(uriString);
    return new URI(notationString);
}
