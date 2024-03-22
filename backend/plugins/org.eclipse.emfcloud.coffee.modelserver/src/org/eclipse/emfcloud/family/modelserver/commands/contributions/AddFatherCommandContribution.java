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
package org.eclipse.emfcloud.family.modelserver.commands.contributions;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.family.modelserver.commands.semantic.AddFatherCommand;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;

public class AddFatherCommandContribution extends BasicCommandContribution<AddFatherCommand> {
   public static final String TYPE = "addFatherContribution";

   @Override
   protected AddFatherCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      String name = command.getProperties().get("firstName");
      return new AddFatherCommand(domain, modelUri, name != null ? name : "");
   }

}
