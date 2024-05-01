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

import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.TimeZone;

import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.AddAutomatedTaskCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.AddDecisionNodeCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.AddFlowCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.AddManualTaskCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.AddMergeNodeCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.AddWeightedFlowCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.RemoveFlowCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.RemoveNodeCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.SetFlowSourceCommandContribution;
import org.eclipse.emfcloud.coffee.modelserver.commands.contributions.SetFlowTargetCommandContribution;
import org.eclipse.emfcloud.family.modelserver.commands.contributions.AddFamilyCommandContribution;
import org.eclipse.emfcloud.family.modelserver.commands.contributions.AddFatherCommandContribution;
import org.eclipse.emfcloud.jackson.module.EMFModule;
import org.eclipse.emfcloud.modelserver.common.utils.MapBinding;
import org.eclipse.emfcloud.modelserver.common.utils.MultiBinding;
import org.eclipse.emfcloud.modelserver.edit.CommandContribution;
import org.eclipse.emfcloud.modelserver.emf.common.ModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.ResourceSetFactory;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.CodecProvider;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.jsonschema.JsonSchemaConverter;
import org.eclipse.emfcloud.modelserver.notation.integration.EMSNotationModelServerModule;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import io.javalin.Javalin;
import io.javalin.plugin.json.JavalinJackson;

public class CoffeeModelServerModule extends EMSNotationModelServerModule {

   @Override
   protected Class<? extends ModelResourceManager> bindModelResourceManager() {
      return CoffeeModelResourceManager.class;
   }

   @Override
   protected void configureCodecs(final MultiBinding<CodecProvider> binding) {
      // TODO Auto-generated method stub
      binding.add(TreeCodecProvider.class);
   }

   @Override
   protected void configureEPackages(final MultiBinding<EPackageConfiguration> binding) {
      super.configureEPackages(binding);
      binding.add(CoffeePackageConfiguration.class);
      binding.add(FamiliesPackageConfiguration.class);
      binding.add(PersonsPackageConfiguration.class);
   }

   @Override
   protected Class<? extends ResourceSetFactory> bindResourceSetFactory() {
      return XMIResourceSetFactory.class;
   }

   @Override
   protected Class<? extends JsonSchemaConverter> bindJsonSchemaConverter() {
      return CustomJsonSchemaConverter.class;

   }

   @Override
   protected Javalin provideJavalin() {
      var jsonMapper = createMapper();
      return Javalin.create(config -> {
         config.enableCorsForAllOrigins();
         config.requestLogger((ctx, ms) -> {
            String requestPath = ctx.path() + (ctx.queryString() == null ? "" : "?" + ctx.queryString());
            LOG.info(ctx.method() + " " + requestPath + " -> Status: " + ctx.status() + " (took " + ms + " ms)");
         });
         config.asyncRequestTimeout = 5000L;
         config.jsonMapper(new JavalinJackson());
         config.wsLogger(ws -> {
            ws.onConnect(ctx -> LOG.info("WS Connected: " + ctx.getSessionId()));
            ws.onMessage(ctx -> LOG.info("WS Received: " + ctx.message() + " by " + ctx.getSessionId()));
            ws.onClose(ctx -> LOG.info("WS Closed: " + ctx.getSessionId()));
            ws.onError(ctx -> LOG.info("WS Errored: " + ctx.getSessionId()));
         });

         config.enableDevLogging();

      });
   }

   private Object createMapper() {
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

   @Override
   protected void configureCommandCodecs(final MapBinding<String, CommandContribution> binding) {
      super.configureCommandCodecs(binding);

      // Families
      binding.put(AddFamilyCommandContribution.TYPE, AddFamilyCommandContribution.class);
      binding.put(AddFatherCommandContribution.TYPE, AddFatherCommandContribution.class);
      // Nodes
      binding.put(AddManualTaskCommandContribution.TYPE, AddManualTaskCommandContribution.class);
      binding.put(AddAutomatedTaskCommandContribution.TYPE, AddAutomatedTaskCommandContribution.class);
      binding.put(AddDecisionNodeCommandContribution.TYPE, AddDecisionNodeCommandContribution.class);
      binding.put(AddMergeNodeCommandContribution.TYPE, AddMergeNodeCommandContribution.class);
      binding.put(RemoveNodeCommandContribution.TYPE, RemoveNodeCommandContribution.class);

      // Flows (Edges)
      binding.put(AddFlowCommandContribution.TYPE, AddFlowCommandContribution.class);
      binding.put(AddWeightedFlowCommandContribution.TYPE, AddWeightedFlowCommandContribution.class);
      binding.put(RemoveFlowCommandContribution.TYPE, RemoveFlowCommandContribution.class);
      binding.put(SetFlowSourceCommandContribution.TYPE, SetFlowSourceCommandContribution.class);
      binding.put(SetFlowTargetCommandContribution.TYPE, SetFlowTargetCommandContribution.class);
   }

   @Override
   protected String getSemanticFileExtension() { return "families"; }

   @Override
   protected String getNotationFileExtension() { return "notation"; }

}
