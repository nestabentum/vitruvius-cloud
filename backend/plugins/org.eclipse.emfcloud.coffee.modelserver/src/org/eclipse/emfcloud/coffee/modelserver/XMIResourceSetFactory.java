/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package org.eclipse.emfcloud.coffee.modelserver;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emf.ecore.xmi.impl.XMIResourceFactoryImpl;
import org.eclipse.emfcloud.modelserver.emf.common.DefaultResourceSetFactory;
import org.eclipse.emfcloud.modelserver.integration.SemanticFileExtension;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationFileExtension;

import com.google.inject.Inject;

public class XMIResourceSetFactory extends DefaultResourceSetFactory {

   @Inject
   @SemanticFileExtension
   protected String semanticFileExtension;
   @Inject
   @NotationFileExtension
   protected String notationFileExtension;

   @Override
   public ResourceSet createResourceSet(final URI modelURI) {
      ResourceSet result = super.createResourceSet(modelURI);
      // if ("families".equals(modelURI.fileExtension())) {
      result.getResourceFactoryRegistry().getExtensionToFactoryMap().put("*", new XMIResourceFactoryImpl());
      return result;
      // }
      //
      // result.getResourceFactoryRegistry().getExtensionToFactoryMap().put(
      // semanticFileExtension, CoffeeResource.FACTORY);
      // result.getResourceFactoryRegistry().getExtensionToFactoryMap().put(
      // notationFileExtension, NotationResource.FACTORY);
      //
      // return result;
   }
}
