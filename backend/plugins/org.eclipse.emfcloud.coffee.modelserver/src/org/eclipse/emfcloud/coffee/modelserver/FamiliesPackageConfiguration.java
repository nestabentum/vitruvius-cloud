/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package org.eclipse.emfcloud.coffee.modelserver;

import java.util.Collection;
import java.util.List;

import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;

import edu.kit.ipd.sdq.metamodels.families.FamiliesPackage;

public class FamiliesPackageConfiguration implements EPackageConfiguration {

   @Override
   public String getId() { // TODO Auto-generated method stub
      return FamiliesPackage.eNS_URI;
   }

   @Override
   public Collection<String> getFileExtensions() { // TODO Auto-generated method stub
      return List.of("families");
   }

   @Override
   public void registerEPackage() {
      FamiliesPackage.eINSTANCE.eClass();

   }

}
