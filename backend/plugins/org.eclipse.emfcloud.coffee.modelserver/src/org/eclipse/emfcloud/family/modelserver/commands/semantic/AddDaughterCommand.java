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

import org.apache.logging.log4j.core.util.UuidUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;

import edu.kit.ipd.sdq.metamodels.families.FamiliesFactory;
import edu.kit.ipd.sdq.metamodels.families.Member;

public class AddDaughterCommand extends FamiliesSemanticElementCommand {
   private final Member daughter;

   public AddDaughterCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.daughter = FamiliesFactory.eINSTANCE.createMember();
      this.daughter.setFirstName("New Daughter");
      this.daughter.setId(UuidUtil.getTimeBasedUuid().toString());
   }

   @Override
   protected void doExecute() {

      getFamily(0).getDaughters().add(this.daughter);

   }

   @Override
   public EObject getCreatedEObject() { return this.daughter; }

}