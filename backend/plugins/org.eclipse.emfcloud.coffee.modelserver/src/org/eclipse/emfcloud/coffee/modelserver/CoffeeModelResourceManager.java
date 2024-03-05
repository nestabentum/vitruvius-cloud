/*******************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ******************************************************************************/
package org.eclipse.emfcloud.coffee.modelserver;

import java.io.File;
import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.notify.AdapterFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.change.ChangeDescription;
import org.eclipse.emf.ecore.change.util.ChangeRecorder;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emfcloud.jackson.module.EMFModule;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.emf.common.ModelServerEditingDomain;
import org.eclipse.emfcloud.modelserver.emf.common.RecordingModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.watchers.ModelWatchersManager;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.emf.configuration.ServerConfiguration;
import org.eclipse.emfcloud.modelserver.emf.util.JsonPatchHelper;
import org.eclipse.emfcloud.modelserver.integration.SemanticFileExtension;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationFileExtension;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.inject.Inject;
import com.google.inject.Provider;

import tools.vitruv.change.composite.description.TransactionalChange;
import tools.vitruv.change.composite.description.VitruviusChange;
import tools.vitruv.change.composite.description.VitruviusChangeResolver;
import tools.vitruv.framework.remote.common.serializer.VitruviusChangeSerializer;

public class CoffeeModelResourceManager extends RecordingModelResourceManager {

   @Inject
   @SemanticFileExtension
   protected String semanticFileExtension;
   @Inject
   @NotationFileExtension
   protected String notationFileExtension;

   private final ObjectMapper objectMapper;

   private final HttpClient httpClient;

   @Inject
   public CoffeeModelResourceManager(final Set<EPackageConfiguration> configurations,
      final AdapterFactory adapterFactory, final ServerConfiguration serverConfiguration,
      final ModelWatchersManager watchersManager, final Provider<JsonPatchHelper> jsonPatchHelper) {

      super(configurations, adapterFactory, serverConfiguration, watchersManager, jsonPatchHelper);
      this.httpClient = HttpClient.newHttpClient();
      this.objectMapper = new ObjectMapper();

      var module = new EMFModule();
      module.addSerializer(VitruviusChange.class, new VitruviusChangeSerializer());
      this.objectMapper.registerModules(module);
   }

   @Override
   public ModelServerEditingDomain getEditingDomain(final ResourceSet resourceSet) {
      var editingDomain = super.getEditingDomain(resourceSet);
      if (editingDomain == null) {
         super.createEditingDomain(resourceSet);
      }
      return super.getEditingDomain(resourceSet);
   }

   @Override
   protected CommandExecutionContext executeCommand(final ModelServerEditingDomain domain, final Command serverCommand,
      final CCommand clientCommand) {
      ChangeRecorder recorder = new ChangeRecorder(domain.getResourceSet());
      tools.vitruv.change.composite.recording.ChangeRecorder vitruvRecorder = null;
      if (containtsViewSerial(clientCommand)) {
         vitruvRecorder = startVitruvChangeRecording(domain);
      }
      CommandExecutionContext context = super.executeCommand(domain, serverCommand, clientCommand);
      ChangeDescription recording = recorder.endRecording();
      if (containtsViewSerial(clientCommand) && vitruvRecorder != null) {
         propagateVitruvChanges(domain, recorder, vitruvRecorder, clientCommand);
      }

      return new RecordingCommandExecutionContext(context, recording);
   }

   private void propagateVitruvChanges(final ModelServerEditingDomain domain, final ChangeRecorder recorder,
      final tools.vitruv.change.composite.recording.ChangeRecorder vitruvRecorder, final CCommand clientCommand) {
      TransactionalChange<EObject> changes = vitruvRecorder.endRecording();
      recorder.dispose();
      var changeResolver = VitruviusChangeResolver.forHierarchicalIds(domain.getResourceSet());
      try {
         domain.startTransaction(false, Map.of());
         var vitruvChanges = changeResolver.assignIds(changes);
         var serializedChanges = objectMapper.writeValueAsString(vitruvChanges);
         var sendChanges = HttpRequest.newBuilder(java.net.URI.create("http://localhost:8070/vsum/view"))
            .header("View-UUID", extractViewId(clientCommand))
            .method("PATCH", BodyPublishers.ofString(serializedChanges)).build();
         var response = httpClient.send(sendChanges, BodyHandlers.ofString());
         System.out.println(response);
      } catch (InterruptedException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
      } catch (JsonProcessingException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
      } catch (IOException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
      }
   }

   private String extractViewId(final CCommand clientCommand) {
      return clientCommand.getProperties().get("viewSerial");
   }

   private tools.vitruv.change.composite.recording.ChangeRecorder startVitruvChangeRecording(
      final ModelServerEditingDomain domain) {
      tools.vitruv.change.composite.recording.ChangeRecorder vitruvRecorder;
      vitruvRecorder = new tools.vitruv.change.composite.recording.ChangeRecorder(
         domain.getResourceSet());
      vitruvRecorder.addToRecording(domain.getResourceSet());
      vitruvRecorder.beginRecording();
      return vitruvRecorder;
   }

   private boolean containtsViewSerial(final CCommand clientCommand) {
      return clientCommand.getProperties().containsKey("viewSerial")
         && clientCommand.getProperties().get("viewSerial") != null;
   }

   @Override
   protected void loadSourceResources(final String directoryPath) {
      if (directoryPath == null || directoryPath.isEmpty()) {
         return;
      }
      File directory = new File(directoryPath);
      File[] list = directory.listFiles();
      Arrays.sort(list);
      for (File file : list) {
         if (isSourceDirectory(file)) {
            loadSourceResources(file.getAbsolutePath());
         } else if (file.isFile()) {
            URI absolutePath = URI.createFileURI(file.getAbsolutePath());
            if (CoffeeResource.FILE_EXTENSION.equals(absolutePath.fileExtension())) {
               getCoffeeResourceSet(absolutePath);
            }
            loadResource(absolutePath.toString());
         }
      }
   }

   /**
    * Get the resource set that manages the given coffee semantic model resource, creating
    * it if necessary.
    *
    * @param modelURI a coffee semantic model resource URI
    * @return its resource set
    */
   protected ResourceSet getCoffeeResourceSet(final URI modelURI) {
      ResourceSet result = resourceSets.get(modelURI);
      if (result == null) {
         result = resourceSetFactory.createResourceSet(modelURI);
         resourceSets.put(modelURI, result);
      }
      return result;
   }

   @Override
   public ResourceSet getResourceSet(final String modeluri) {
      URI resourceURI = createURI(modeluri);
      if (notationFileExtension.equals(resourceURI.fileExtension())) {
         URI semanticUri = resourceURI.trimFileExtension().appendFileExtension(semanticFileExtension);
         return getCoffeeResourceSet(semanticUri);
      }
      if ("families".equals(resourceURI.fileExtension())) {
         return getFamiliesResourceSet(resourceURI);
      }
      return resourceSets.get(resourceURI);
   }

   private ResourceSet getFamiliesResourceSet(final URI modelURI) {
      ResourceSet result = resourceSets.get(modelURI);
      if (result == null) {
         result = resourceSetFactory.createResourceSet(modelURI);
         resourceSets.put(modelURI, result);
      }
      return result;

   }

   @Override
   public boolean save(final String modeluri) {
      boolean result = false;
      for (Resource resource : getResourceSet(modeluri).getResources()) {
         result = saveResource(resource) || result;
      }
      if (result) {
         getEditingDomain(getResourceSet(modeluri)).saveIsDone();
      }
      return result;
   }
}
