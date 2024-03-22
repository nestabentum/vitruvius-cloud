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
import org.eclipse.emf.edit.domain.EditingDomain;

import edu.kit.ipd.sdq.metamodels.families.FamiliesFactory;
import edu.kit.ipd.sdq.metamodels.families.Member;

public class AddFatherCommand extends FamiliesSemanticElementCommand {
   private final Member father;

   public AddFatherCommand(final EditingDomain domain, final URI modelUri, final String name) {
      super(domain, modelUri);
      father = FamiliesFactory.eINSTANCE.createMember();
      father.setFirstName(name);

   }

   @Override
   protected void doExecute() {
      getFamily(0).setFather(father);

   }

}
