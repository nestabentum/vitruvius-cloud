/*******************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ******************************************************************************/
package org.eclipse.emfcloud.coffee.modelserver.commands.util;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.coffee.modelserver.CoffeeResource;

import edu.kit.ipd.sdq.metamodels.families.FamilyRegister;

public final class SemanticCommandUtil {

   // Hide constructor for utility class
   private SemanticCommandUtil() {}

   // Expect a given EObject with an ID attribute
   public static String getSemanticElementId(final EObject element) {
      return EcoreUtil.getID(element);
   }

   public static String getCoffeeFileExtension() { return CoffeeResource.FILE_EXTENSION; }

   public static String getFamilyFileExtension() { return "families"; }

   public static FamilyRegister getFamilyModel(final URI modelUri, final EditingDomain domain) {
      Resource semanticResource = domain.getResourceSet()
         .getResource(modelUri.trimFileExtension().appendFileExtension(getFamilyFileExtension()), false);
      EObject semanticRoot = semanticResource.getContents().get(0);
      if (!(semanticRoot instanceof FamilyRegister)) {
         return null;
      }
      FamilyRegister familyRegister = (FamilyRegister) semanticRoot;
      return familyRegister;
   }
}
