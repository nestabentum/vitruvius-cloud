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
package org.eclipse.emfcloud.family.modelserver.commands.semantic;

import java.util.UUID;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

import edu.kit.ipd.sdq.metamodels.families.FamiliesFactory;
import edu.kit.ipd.sdq.metamodels.families.Family;

public class AddFamilyCommand extends FamiliesSemanticElementCommand {
   private final Family family;

   public AddFamilyCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      family = FamiliesFactory.eINSTANCE.createFamily();
      family.setLastName("");
      family.setId(UUID.randomUUID().toString());
   }

   @Override
   protected void doExecute() {
      semanticModel.getFamilies().add(family);
   }

}
