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

import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.file.Path;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emf.transaction.RollbackException;
import org.eclipse.emfcloud.coffee.modelserver.vitruvius.ChangeRecorderCache;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.Routing;
import org.eclipse.emfcloud.modelserver.emf.common.ModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.ModelServerEditingDomain;
import org.eclipse.emfcloud.modelserver.emf.common.ModelURIConverter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.inject.Inject;

import io.javalin.Javalin;
import io.javalin.http.Context;
import tools.vitruv.change.composite.description.TransactionalChange;
import tools.vitruv.change.composite.description.VitruviusChangeResolver;
import tools.vitruv.change.composite.recording.ChangeRecorder;
import tools.vitruv.framework.remote.common.util.JsonMapper;

public class VitruvRouting implements Routing {

   private final Javalin javalin;
   private final ChangeRecorderCache changeRecorderCache;
   protected final ModelURIConverter uriConverter;
   private final HttpClient httpClient;
   private final static String viewSerialKey = "viewSerial";
   private final static String viewUriKey = "uri";
   private final JsonMapper objectMapper;
   private final ModelResourceManager modelResourceManager;

   @Inject
   @SuppressWarnings("checkstyle:ParameterNumber")
   public VitruvRouting(final Javalin javalin,
      final ChangeRecorderCache changeRecorderCache, final ModelURIConverter uriConverter,
      final ModelResourceManager modelResourceManager) {
      this.changeRecorderCache = changeRecorderCache;
      this.javalin = javalin;
      this.uriConverter = uriConverter;
      this.httpClient = HttpClient.newHttpClient();
      this.objectMapper = new JsonMapper(Path.of("/cloud-vsum"));
      this.modelResourceManager = modelResourceManager;
   }

   @Override
   public void bindRoutes() {

      javalin.routes(() -> path("api/v2", () -> {
         get("save-me", this::saveVitruvView);
         get("register-view", this::registerView);
      }));

   }

   private void registerView(final Context ctxt) {
      System.out.println("REGISTERING VIEW");
      uriConverter.withResolvedModelURI(ctxt, uri -> registerView(uri, ctxt));

   }

   private void registerView(final String uri, final Context ctxt) {
      String originalResourceUri = ctxt.queryParam("originalResourceURI");
      String viewUri = ctxt.queryParam("viewURI");
      if (originalResourceUri == null) {
         ctxt.res.setStatus(500);
      }
      ResourceSet set = modelResourceManager.getResourceSet(uri);
      changeRecorderCache.cache(URI.createURI(uri), startVitruvChangeRecording(set), originalResourceUri, viewUri);
   }

   private ChangeRecorder startVitruvChangeRecording(
      final ResourceSet resourceSet) {
      ChangeRecorder vitruvRecorder;
      vitruvRecorder = new ChangeRecorder(
         resourceSet);
      vitruvRecorder.addToRecording(resourceSet);
      vitruvRecorder.beginRecording();
      return vitruvRecorder;
   }

   private void saveVitruvView(final Context ctxt) {
      System.out.println("SAVING VIEW");
      uriConverter.withResolvedModelURI(ctxt, uri -> processSaving(uri));

   }

   private void processSaving(final String modelUri) {
      var recorder = changeRecorderCache.getChangeRecorder(URI.createURI(modelUri));
      propagateVitruvChanges(recorder, modelUri);

   }

   private void propagateVitruvChanges(
      final tools.vitruv.change.composite.recording.ChangeRecorder vitruvRecorder, final String uri) {
      TransactionalChange<EObject> changes = vitruvRecorder.endRecording();
      // vitruvRecorder.close();
      ResourceSet set = modelResourceManager.getResourceSet(uri);
      var changeResolver = VitruviusChangeResolver.forHierarchicalIds(set);
      ModelServerEditingDomain editingDomain = null;
      try {
         editingDomain = modelResourceManager.getEditingDomain(set);
         editingDomain.startTransaction(false, null);
         var vitruvChanges = changeResolver.assignIds(changes);
         var serializedChanges = objectMapper.serialize(vitruvChanges);

         String uriToReplace = set.getResources().stream().findFirst().get().getURI()
            .toString();
         var targetFileURI = URI.createFileURI(changeRecorderCache.getOriginalResourceUri(URI.createURI(uri)))
            .toString();

         serializedChanges = serializedChanges.replaceAll("(?i)" + uriToReplace, targetFileURI);

         var sendChanges = HttpRequest.newBuilder(java.net.URI.create("http://localhost:8070/vsum/view"))
            .header("View-UUID", changeRecorderCache.getViewUri(URI.createURI(uri)))
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
      } finally {
         vitruvRecorder.beginRecording();
         if (editingDomain != null) {
            try {
               editingDomain.getActiveTransaction().commit();
            } catch (RollbackException e) {
               // TODO Auto-generated catch block
               e.printStackTrace();
            }
         }
      }

   }

   private String extractViewId(final CCommand clientCommand) {
      return clientCommand.getProperties().get(viewSerialKey);
   }

   private String extractViewURI(final CCommand clientCommand) {
      return clientCommand.getProperties().get(viewUriKey);
   }
}
