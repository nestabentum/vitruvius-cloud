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
package org.eclipse.emfcloud.coffee.workflow.glsp.server.palette;

import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.WorkflowModelTypes;
import org.eclipse.glsp.server.actions.TriggerNodeCreationAction;
import org.eclipse.glsp.server.features.toolpalette.PaletteItem;
import org.eclipse.glsp.server.features.toolpalette.ToolPaletteItemProvider;

import com.google.common.collect.Lists;

public class WorkflowToolPaletteItemProvider implements ToolPaletteItemProvider {

   private static Logger LOGGER = LogManager.getLogger(WorkflowToolPaletteItemProvider.class.getSimpleName());

   @Override
   public List<PaletteItem> getItems(final Map<String, String> args) {
      LOGGER.info("Create palette");
      return Lists.newArrayList(persons());
   }

   private PaletteItem persons() {
      PaletteItem createPerson = node(WorkflowModelTypes.DAUGHTER, "Daughter", "grabber");

      List<PaletteItem> nodes = Lists.newArrayList(createPerson);
      return PaletteItem.createPaletteGroup("person-group", "Add Members", nodes, "symbol-property", "a");
   }

   private PaletteItem node(final String elementTypeId, final String label, final String icon) {
      return new PaletteItem(elementTypeId, label, new TriggerNodeCreationAction(elementTypeId), icon);
   }
}
