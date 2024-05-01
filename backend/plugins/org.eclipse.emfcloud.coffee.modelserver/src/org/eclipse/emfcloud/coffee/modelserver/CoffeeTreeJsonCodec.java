/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package org.eclipse.emfcloud.coffee.modelserver;

import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.TimeZone;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emfcloud.jackson.module.EMFModule;
import org.eclipse.emfcloud.modelserver.common.codecs.DefaultJsonCodec;
import org.eclipse.emfcloud.modelserver.common.codecs.EMFJsonConverter;
import org.eclipse.emfcloud.modelserver.common.codecs.EncodingException;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.jackson.EMFModuleV2;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * almost copy of JsonCodecV2. except for disabled type serialization minimizing.
 *
 * @author nbe_adm
 *
 */
public class CoffeeTreeJsonCodec extends DefaultJsonCodec {

   public CoffeeTreeJsonCodec() {
      super(createEMFJsonConverterV2());
   }

   protected ObjectMapper createObjectMapper() {
      final ObjectMapper mapper = new ObjectMapper();
      // same as emf
      final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.ENGLISH);
      dateFormat.setTimeZone(TimeZone.getDefault());

      mapper.configure(SerializationFeature.INDENT_OUTPUT, true);
      mapper.setDateFormat(dateFormat);
      mapper.setTimeZone(TimeZone.getDefault());

      EMFModule emfModule = new EMFModule();
      // Write XMI ids in property "@id". For customization see
      // https://github.com/eclipse-emfcloud/emfjson-jackson/wiki/Customization#custom-id-field
      emfModule.configure(EMFModule.Feature.OPTION_USE_ID, true);
      emfModule.configure(EMFModule.Feature.OPTION_SERIALIZE_DEFAULT_VALUE, true);
      emfModule.configure(EMFModule.Feature.OPTION_SERIALIZE_TYPE, true);
      emfModule.configure(EMFModule.Feature.OPTION_MINIMIZE_TYPE_INFO, false);

      mapper.registerModule(emfModule);
      return mapper;
   }

   private static EMFJsonConverter createEMFJsonConverterV2() {
      EMFJsonConverter emfJsonConverter = new EMFJsonConverter();
      emfJsonConverter.setMapper(setupObjectMapperV2());
      return emfJsonConverter;
   }

   private static ObjectMapper setupObjectMapperV2() {
      final ObjectMapper mapper = new ObjectMapper();
      // same as emf
      final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.ENGLISH);
      dateFormat.setTimeZone(TimeZone.getDefault());
      EMFModuleV2 emfModule = new EMFModuleV2();
      emfModule.configure(EMFModule.Feature.OPTION_MINIMIZE_TYPE_INFO, false);
      mapper.configure(SerializationFeature.INDENT_OUTPUT, true);
      mapper.setDateFormat(dateFormat);
      mapper.setTimeZone(TimeZone.getDefault());
      mapper.registerModule(emfModule);
      return mapper;
   }

   @Override
   public JsonNode encode(final EObject obj) throws EncodingException {
      // The super implementation creates a JsonResource, which doesn't (seem to) support
      // IDs at all. When used with the $id: feature, it results in $id:null for all elements.

      Resource original = obj.eResource();
      if (original == null) {
         // If it's not in a resource, then the superclass implementation will do just as well
         // because nothing can have an ID, anyways
         return super.encode(obj);
      }

      // FIXME: Directly serialize the object, without moving it to a separate resource.
      // However, by doing this, we might break href-references in some cases? TO BE INVESTIGATED
      // Alternatively, we could use a custom ID-Provider (Or delegate to the original resource for IDs?)
      return DefaultJsonCodec.encode(obj, getObjectMapper());
   }
}
