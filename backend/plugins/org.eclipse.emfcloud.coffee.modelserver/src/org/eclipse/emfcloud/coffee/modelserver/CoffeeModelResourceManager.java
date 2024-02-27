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
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.emf.common.ModelServerEditingDomain;
import org.eclipse.emfcloud.modelserver.emf.common.RecordingModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.watchers.ModelWatchersManager;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.emf.configuration.ServerConfiguration;
import org.eclipse.emfcloud.modelserver.emf.util.JsonPatchHelper;
import org.eclipse.emfcloud.modelserver.integration.SemanticFileExtension;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationFileExtension;

import com.google.inject.Inject;
import com.google.inject.Provider;

import tools.vitruv.change.composite.description.TransactionalChange;
import tools.vitruv.change.composite.description.VitruviusChangeResolver;

public class CoffeeModelResourceManager extends RecordingModelResourceManager {

   @Inject
   @SemanticFileExtension
   protected String semanticFileExtension;
   @Inject
   @NotationFileExtension
   protected String notationFileExtension;

   @Override
   protected CommandExecutionContext executeCommand(final ModelServerEditingDomain domain, final Command serverCommand,
      final CCommand clientCommand) {
      ChangeRecorder recorder = new ChangeRecorder(domain.getResourceSet());
      tools.vitruv.change.composite.recording.ChangeRecorder vitruvRecorder = new tools.vitruv.change.composite.recording.ChangeRecorder(
         domain.getResourceSet());
      vitruvRecorder.addToRecording(domain.getResourceSet());
      vitruvRecorder.beginRecording();
      CommandExecutionContext context = super.executeCommand(domain, serverCommand, clientCommand);
      ChangeDescription recording = recorder.endRecording();
      TransactionalChange<EObject> changes = vitruvRecorder.endRecording();
      recorder.dispose();
      var changeResolver = VitruviusChangeResolver.forHierarchicalIds(domain.getResourceSet());
      try {
         domain.startTransaction(false, Map.of());
         var vitruvChanges = changeResolver.assignIds(changes);
      } catch (InterruptedException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
      }

      return new RecordingCommandExecutionContext(context, recording);
   }

   @Inject
   public CoffeeModelResourceManager(final Set<EPackageConfiguration> configurations,
      final AdapterFactory adapterFactory, final ServerConfiguration serverConfiguration,
      final ModelWatchersManager watchersManager, final Provider<JsonPatchHelper> jsonPatchHelper) {

      super(configurations, adapterFactory, serverConfiguration, watchersManager, jsonPatchHelper);
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
