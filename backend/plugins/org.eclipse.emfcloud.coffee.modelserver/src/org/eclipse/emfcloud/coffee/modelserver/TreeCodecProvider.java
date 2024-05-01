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

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Supplier;

import org.eclipse.emfcloud.modelserver.common.ModelServerPathParametersV2;
import org.eclipse.emfcloud.modelserver.common.codecs.Codec;
import org.eclipse.emfcloud.modelserver.common.codecs.XmiCodec;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.CodecProvider;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.JsonCodec;

/**
 * almost copy of DefaultCodecsProvider. except for usage of CoffeTreeJsonCodec as JSON V2 Codec.
 *
 */
public class TreeCodecProvider implements CodecProvider {

   private final Map<String, Supplier<Codec>> supportedFormats = new LinkedHashMap<>();

   public TreeCodecProvider() {
      this.supportedFormats.put(ModelServerPathParametersV2.FORMAT_XMI, XmiCodec::new);
      this.supportedFormats.put(ModelServerPathParametersV2.FORMAT_JSON, JsonCodec::new);
      this.supportedFormats.put(ModelServerPathParametersV2.FORMAT_JSON_V2, CoffeeTreeJsonCodec::new);

   }

   @Override
   public Set<String> getAllFormats() { // TODO Auto-generated method stub
      return supportedFormats.keySet();
   }

   @Override
   public int getPriority(final String modelUri, final String format) {
      // TODO Auto-generated method stub
      return getAllFormats().contains(format) ? 1 : NOT_SUPPORTED;
   }

   @Override
   public Optional<Codec> getCodec(final String modelUri, final String format) {
      Supplier<Codec> codecSupplier = supportedFormats.get(format);
      if (codecSupplier == null) {
         return Optional.empty();
      }
      return Optional.of(codecSupplier.get());
   }
}
