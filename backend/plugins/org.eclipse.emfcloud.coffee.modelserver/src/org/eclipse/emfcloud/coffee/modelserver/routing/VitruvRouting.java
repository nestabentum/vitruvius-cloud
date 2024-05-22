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
package org.eclipse.emfcloud.coffee.modelserver.routing;

import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.path;

import org.eclipse.emfcloud.modelserver.common.Routing;

import com.google.inject.Inject;

import io.javalin.Javalin;
import io.javalin.http.Context;

public class VitruvRouting implements Routing {

   private final Javalin javalin;

   @Inject
   @SuppressWarnings("checkstyle:ParameterNumber")
   public VitruvRouting(final Javalin javalin) {

      this.javalin = javalin;
   }

   @Override
   public void bindRoutes() {
      javalin.routes(() -> path("api/v2/", () -> get("save-me", this::saveVitruvView)));

   }

   private void saveVitruvView(final Context ctxt) {
      System.out.println("SAVE ME");
   }
}
