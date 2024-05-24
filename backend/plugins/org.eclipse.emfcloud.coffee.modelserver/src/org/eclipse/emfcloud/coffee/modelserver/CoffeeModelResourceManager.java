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
import java.net.http.HttpClient;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.eclipse.emf.common.notify.AdapterFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emf.ecore.xmi.XMLResource;
import org.eclipse.emfcloud.coffee.modelserver.vitruvius.ChangeRecorderCache;
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

public class CoffeeModelResourceManager extends RecordingModelResourceManager {

   @Inject
   @SemanticFileExtension
   protected String semanticFileExtension;
   @Inject
   @NotationFileExtension
   protected String notationFileExtension;

   private final ChangeRecorderCache changeRecorderCache;

   private final HttpClient httpClient;
   private final static String viewSerialKey = "viewSerial";
   private final static String viewUriKey = "uri";

   @Inject
   public CoffeeModelResourceManager(final Set<EPackageConfiguration> configurations,
      final AdapterFactory adapterFactory, final ServerConfiguration serverConfiguration,
      final ModelWatchersManager watchersManager, final Provider<JsonPatchHelper> jsonPatchHelper,
      final ChangeRecorderCache changeRecorderCache) {

      super(configurations, adapterFactory, serverConfiguration, watchersManager, jsonPatchHelper);
      this.changeRecorderCache = changeRecorderCache;
      this.httpClient = HttpClient.newHttpClient();

   }

   @Override
   @SuppressWarnings("checkstyle:IllegalCatch")
   public Optional<Resource> loadResource(final String modeluri) {
      try {
         ResourceSet rset = getResourceSet(modeluri);
         URI resourceURI = createURI(modeluri);
         // Note that the resource set may be absent if the resource does not exist
         Optional<Resource> loadedResource = Optional.ofNullable(rset).map(rs -> rs.getResource(resourceURI, false))
            .filter(Resource::isLoaded);
         if (loadedResource.isPresent() || rset == null) {
            return loadedResource;
         }
         // do load the resource and watch for modifications
         Resource resource = rset.getResource(resourceURI, true);
         resource.load(Map.of(XMLResource.OPTION_SAVE_TYPE_INFORMATION, true));
         return Optional.of(resource);
      } catch (final Exception e) {
         handleLoadError(modeluri, this.isInitializing, e);
         return Optional.empty();
      }
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
               getResourceSet(absolutePath);
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
   protected ResourceSet getResourceSet(final URI modelURI) {
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
         return getResourceSet(semanticUri);
      }
      ResourceSet result = resourceSets.get(resourceURI);
      if (result == null) {
         result = resourceSetFactory.createResourceSet(resourceURI);
         resourceSets.put(resourceURI, result);
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
