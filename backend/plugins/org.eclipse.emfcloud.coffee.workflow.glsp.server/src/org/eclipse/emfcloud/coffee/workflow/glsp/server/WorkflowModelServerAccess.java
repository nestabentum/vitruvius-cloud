/*******************************************************************************
 * Copyright (c) 2019-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ******************************************************************************/
package org.eclipse.emfcloud.coffee.workflow.glsp.server;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.validation.WorkflowValidationResultChangeListener;
import org.eclipse.emfcloud.family.modelserver.commands.contributions.AddDaughterCommandContribution;
import org.eclipse.emfcloud.modelserver.client.Response;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.emf.common.DefaultModelURIConverter;
import org.eclipse.emfcloud.modelserver.emf.common.EMFFacetConstraints;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationModelServerAccess;
import org.eclipse.emfcloud.validation.framework.ValidationFilter;
import org.eclipse.emfcloud.validation.framework.ValidationFramework;
import org.eclipse.emfcloud.validation.framework.ValidationResult;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.actions.ActionDispatcher;
import org.eclipse.glsp.server.types.GLSPServerException;
import org.eclipse.glsp.server.utils.ClientOptionsUtil;

public class WorkflowModelServerAccess extends EMSNotationModelServerAccess {

   private static Logger LOGGER = LogManager.getLogger(WorkflowModelServerAccess.class);

   private ValidationFramework validationFramework;

   @Override
   public void setClientOptions(final Map<String, String> clientOptions) {
      this.clientOptions = clientOptions;
      String sourceURI = ClientOptionsUtil.getSourceUri(clientOptions)
         .orElseThrow(() -> new GLSPServerException("No source URI given to load model!"));
      // ensure URIs (windows, unix) are parsed correctly
      URI absoluteFilePath = DefaultModelURIConverter.parseURI(sourceURI);
      // remove file scheme if any
      URI uri = URI.createURI(absoluteFilePath.toString().replace("file:/", ""));
      this.baseSourceUri = uri.trimFileExtension();
   }

   public void createValidationFramework(final String clientId, final ActionDispatcher actionDispatcher) {
      WorkflowValidationResultChangeListener changeListener = new WorkflowValidationResultChangeListener(
         clientId, actionDispatcher);
      try {
         this.validationFramework = new ValidationFramework(this.getSemanticURI(), changeListener);
      } catch (MalformedURLException e) {
         LOGGER.error("Creation of ValidationFramework failed!");
         e.printStackTrace();
      }
   }

   public CompletableFuture<Response<String>> addDaughter(final Optional<GPoint> position) {
      CCompoundCommand command = AddDaughterCommandContribution.create(position.orElse(GraphUtil.point(0, 0)));
      return this.edit(command);
   }

   protected String getOwnerRefUri(final EObject element) {
      String absoluteFilePath = baseSourceUri.appendFileExtension(this.semanticFileExtension).toString();
      return DefaultModelURIConverter.parseURI(absoluteFilePath).appendFragment(idGenerator.getOrCreateId(element))
         .toString();
   }

   @Override
   public CompletableFuture<Response<String>> validate() {
      return modelServerClient.validate(getSemanticURI());
   }

   public CompletableFuture<Void> validateViaFramework() throws IOException, InterruptedException, ExecutionException {
      return this.validationFramework.validate();
   }

   public List<ValidationResult> getValidationResult() throws IOException, InterruptedException, ExecutionException {
      return this.validationFramework.getRecentValidationResult();
   }

   public void initConstraintList() {
      this.validationFramework.getConstraintList();
   }

   public EMFFacetConstraints getConstraintList(final String elementID, final String featureID) {
      Map<String, EMFFacetConstraints> featureMap = this.validationFramework.getInputValidationMap().get(elementID);
      if (featureMap != null) {
         return featureMap.get(featureID);
      }
      return null;
   }

   public void subscribeToValidation() {
      this.validationFramework.subscribeToValidation();
   }

   public void addValidationFilter(final List<ValidationFilter> contraintValues)
      throws IOException, InterruptedException, ExecutionException {
      this.validationFramework.addValidationFilter(contraintValues);
   }

   public void removeValidationFilter(final List<ValidationFilter> contraintValues)
      throws IOException, InterruptedException, ExecutionException {
      this.validationFramework.removeValidationFilter(contraintValues);
   }

   public void toggleValidationFilter(final ValidationFilter contraintValue)
      throws IOException, InterruptedException, ExecutionException {
      this.validationFramework.toggleValidationFilter(contraintValue);
   }
}
