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
package org.eclipse.emfcloud.family.modelserver.commands.compound;

import java.util.function.Supplier;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.family.modelserver.commands.semantic.AddDaughterCommand;
import org.eclipse.emfcloud.modelserver.glsp.notation.commands.AddShapeCommand;
import org.eclipse.glsp.graph.GPoint;

public class AddDaughterCompoundCommand extends CompoundCommand {
   public AddDaughterCompoundCommand(final EditingDomain domain, final URI modelUri, final GPoint classPosition) {
      AddDaughterCommand addDaughterCommand = new AddDaughterCommand(domain, modelUri);
      this.append(addDaughterCommand);
      Supplier<EObject> semanticResultSupplier = () -> addDaughterCommand.getCreatedEObject();
      this.append(new AddShapeCommand(domain, modelUri, classPosition, semanticResultSupplier));

   }
}
