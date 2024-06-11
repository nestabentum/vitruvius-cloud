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

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emf.transaction.RecordingCommand;
import org.eclipse.emf.transaction.TransactionalEditingDomain;
import org.eclipse.emfcloud.coffee.modelserver.commands.util.SemanticCommandUtil;

import edu.kit.ipd.sdq.metamodels.persons.PersonRegister;

public abstract class PersonsSemanticCommand extends RecordingCommand {
   protected final PersonRegister semanticModel;

   public PersonsSemanticCommand(final EditingDomain domain, final URI modelUri) {
      super((TransactionalEditingDomain) domain);
      this.semanticModel = SemanticCommandUtil.getPersonsModel(modelUri, domain);
   }

   protected PersonRegister getPersonRegister() {

      return semanticModel;
   }

   abstract public EObject getCreatedEObject();
}
