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
package org.eclipse.emfcloud.coffee.modelserver.vitruvius;

import java.util.Map;

import org.eclipse.emf.common.util.URI;

import com.google.common.collect.Maps;

import tools.vitruv.change.composite.recording.ChangeRecorder;

public class ChangeRecorderCache {
   private final Map<URI, VitruvInformation> changeRecorders = Maps
      .newLinkedHashMap();

   public void cache(final URI uri, final ChangeRecorder cahngeRecorder, final String originalResourceUri,
      final String viewUri) {
      VitruvInformation vitruvInformation = new VitruvInformation(cahngeRecorder, originalResourceUri, viewUri);
      changeRecorders.put(uri, vitruvInformation);

   }

   public ChangeRecorder getChangeRecorder(final URI uri) {
      VitruvInformation vitruvInformation = changeRecorders.get(uri);
      if (vitruvInformation == null) {
         return null;
      }
      return vitruvInformation.getChangeRecorder();
   }

   public String getOriginalResourceUri(final URI uri) {
      VitruvInformation vitruvInformation = changeRecorders.get(uri);
      if (vitruvInformation == null) {
         return null;
      }
      return vitruvInformation.getOriginalResourceUri();
   }

   public String getViewUri(final URI uri) {
      VitruvInformation vitruvInformation = changeRecorders.get(uri);
      if (vitruvInformation == null) {
         return null;
      }
      return vitruvInformation.getViewUri();
   }

   private class VitruvInformation {
      private final ChangeRecorder changeRecorder;
      private final String originalResourceUri;
      private final String viewUri;

      public ChangeRecorder getChangeRecorder() { return changeRecorder; }

      public String getOriginalResourceUri() { return originalResourceUri; }

      public String getViewUri() { return viewUri; }

      public VitruvInformation(final ChangeRecorder changeRecorder, final String originalResourceUri,
         final String viewUri) {
         super();
         this.changeRecorder = changeRecorder;
         this.originalResourceUri = originalResourceUri;
         this.viewUri = viewUri;
      }

   }

}
