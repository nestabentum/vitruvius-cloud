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

import org.eclipse.emf.ecore.EClassifier;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emfcloud.modelserver.jsonschema.DefaultJsonSchemaConverter;
import org.eclipse.emfcloud.modelserver.jsonschema.Json;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class CustomJsonSchemaConverter extends DefaultJsonSchemaConverter {

   @Override
   public JsonNode from(final EObject eObject) {

      return createJsonSchemaFromEPackage(eObject.eClass().getEPackage());
   }

   @Override
   protected ObjectNode createPropertiesFromEClassifier(final EClassifier eClassifier) {
      ObjectNode node = super.createPropertiesFromEClassifier(eClassifier);

      node.set("$type", node.get("eClass"));
      node.remove("eClass");
      return node;
   }

   @Override
   public JsonNode createJsonSchemaFromEPackage(final EPackage ePackage) {
      final ObjectNode schemaNode = Json.object();

      final ObjectNode definitionsNode = Json.object();
      ePackage.getEClassifiers().forEach(eClassifier -> {
         definitionsNode.set(eClassifier.getName().trim().toLowerCase(), createDefinitionFromEClassifier(eClassifier));
      });

      schemaNode.set("definitions", definitionsNode);
      return schemaNode;
   }

}
