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
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;

import edu.kit.ipd.sdq.metamodels.persons.Female;
import edu.kit.ipd.sdq.metamodels.persons.PersonsFactory;

public class AddFemaleCommand extends PersonsSemanticCommand {
   private final Female female;

   public AddFemaleCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.female = PersonsFactory.eINSTANCE.createFemale();
      this.female.setId(UUID.randomUUID().toString());
   }

   @Override
   public EObject getCreatedEObject() { // TODO Auto-generated method stub
      return this.female;
   }

   @Override
   protected void doExecute() {
      getPersonRegister().getPersons().add(female);

   }

}
