/*******************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ******************************************************************************/
package org.eclipse.emfcloud.coffee.workflow.glsp.server.gmodel;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emfcloud.coffee.Flow;
import org.eclipse.emfcloud.coffee.Node;
import org.eclipse.emfcloud.coffee.Task;
import org.eclipse.emfcloud.coffee.WeightedFlow;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.WorkflowHighlightStore;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.WorkflowModelTypes;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.util.CoffeeTypeUtil;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.util.WorkflowBuilder.ActivityNodeBuilder;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.util.WorkflowBuilder.TaskNodeBuilder;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.util.WorkflowBuilder.WeightedEdgeBuilder;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.wfgraph.ActivityNode;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.wfgraph.TaskNode;
import org.eclipse.emfcloud.coffee.workflow.glsp.server.wfgraph.WeightedEdge;
import org.eclipse.emfcloud.modelserver.glsp.notation.integration.EMSNotationGModelFactory;
import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GGraph;
import org.eclipse.glsp.graph.GModelRoot;
import org.eclipse.glsp.graph.GNode;
import org.eclipse.glsp.graph.builder.AbstractGEdgeBuilder;
import org.eclipse.glsp.graph.builder.AbstractGNodeBuilder;
import org.eclipse.glsp.graph.builder.impl.GArguments;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.builder.impl.GLayoutOptions;
import org.eclipse.glsp.graph.builder.impl.GNodeBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.emf.model.notation.Diagram;
import org.eclipse.glsp.server.emf.model.notation.Edge;
import org.eclipse.glsp.server.emf.model.notation.Shape;

import com.google.inject.Inject;

import edu.kit.ipd.sdq.metamodels.families.Family;
import edu.kit.ipd.sdq.metamodels.families.FamilyRegister;
import edu.kit.ipd.sdq.metamodels.families.Identifiable;
import edu.kit.ipd.sdq.metamodels.families.Member;

public class WorkflowGModelFactory extends EMSNotationGModelFactory {

   @Inject
   protected WorkflowHighlightStore highlightStore;

   private String getChangeCssClass(final EObject object) {
      return highlightStore.getHighlights().get(EcoreUtil.getURI(object).toString().substring(1));
   }

   private GEdge createEdge(final Identifiable source, final Identifiable target) {
      GEdgeBuilder builder = new GEdgeBuilder()
         .id(source.getId() + "_" + target.getId())
         .sourceId(idGenerator.getOrCreateId(source))
         .targetId(idGenerator.getOrCreateId(target))
         .routerKind(GConstants.RouterKind.POLYLINE);
      applyEdgeData(source, builder);
      return builder.build();

   }

   @Override
   protected void fillRootElement(final EObject semanticModel, final Diagram notationModel, final GModelRoot newRoot) {
      // Workflow workflowModel = Machine.class.cast(semanticModel).getWorkflows().get(0);
      FamilyRegister register = FamilyRegister.class.cast(semanticModel);
      GGraph graph = GGraph.class.cast(newRoot);

      if (notationModel.getSemanticElement() == null
         || notationModel.getSemanticElement().getResolvedSemanticElement() == null) {
         return;
      }
      graph.setId(idGenerator.getOrCreateId(register));
      register.getFamilies().stream().map(this::createFamilyNode).forEach(graph.getChildren()::add);
      register.getFamilies().stream().flatMap(fam -> fam.getDaughters().stream())
         .filter(Objects::nonNull).map(this::createMemberNode).forEach(graph.getChildren()::add);
      register.getFamilies().stream().flatMap(fam -> fam.getSons().stream())
         .filter(Objects::nonNull).map(this::createMemberNode)
         .forEach(graph.getChildren()::add);
      register.getFamilies().stream().map(Family::getFather).filter(Objects::nonNull).map(this::createMemberNode)
         .forEach(graph.getChildren()::add);
      register.getFamilies().stream().map(Family::getMother).filter(Objects::nonNull).map(this::createMemberNode)
         .forEach(graph.getChildren()::add);

      for (Family family : register.getFamilies()) {
         Member mother = family.getMother();
         Member father = family.getFather();
         graph.getChildren().add(createEdge(family, father));
         graph.getChildren().add(createEdge(family, mother));
         // if (father != null && mother != null) {
         // GNode node = createFamilyRelationNode(family);
         // graph.getChildren().add(node);
         // }
         graph.getChildren().add(createEdge(mother, father));
         for (Member son : family.getSons()) {
            graph.getChildren().add(createEdge(father, son));
            graph.getChildren().add(createEdge(mother, son));

         }
         for (Member daughters : family.getDaughters()) {
            graph.getChildren().add(createEdge(father, daughters));
            graph.getChildren().add(createEdge(mother, daughters));
         }

      }

      // for (Family family : register.getFamilies()) {
      //
      // Member father = family.getFather();
      //
      // GEdgeBuilder builder = new GEdgeBuilder()
      // .id(father.getId() + "_" + family.getId())
      // .sourceId(idGenerator.getOrCreateId(family))
      // .targetId(idGenerator.getOrCreateId(father))
      // .routerKind(GConstants.RouterKind.POLYLINE);
      // applyEdgeData(family, builder);
      // var edge = builder.build();
      //
      // graph.getChildren().add(edge);
      // }
      // Add Nodes
      // workflowModel.getNodes().stream().map(this::createNode)
      // .forEachOrdered(graph.getChildren()::add);

      // Add Flows
      // workflowModel.getFlows().stream().map(this::createEdge)
      // .forEachOrdered(graph.getChildren()::add);

   }

   private GNode createFamilyRelationNode(final Family family) {
      var header = new GLabelBuilder(WorkflowModelTypes.LABEL_HEADING) //
         .id(family.getId() + "_relation_classname") //
         .text("family") //
         .build();

      String type = WorkflowModelTypes.MALE_PERSON;

      GNodeBuilder builder = new GNodeBuilder(type);
      builder.id(family.getId());
      builder.addArguments(GArguments.cornerRadius(5));

      applyShapeData(family, builder);
      var finalNode = builder.build();
      finalNode.getChildren().add(header);
      finalNode.getCssClasses().add("task");
      return finalNode;

   }

   protected GEdge createSonEdge(final Member member, final Family family) {

      GEdgeBuilder builder = new GEdgeBuilder()
         .id(member.getId() + "_" + family.getId())
         .sourceId(idGenerator.getOrCreateId(family))
         .targetId(idGenerator.getOrCreateId(member))
         .routerKind(GConstants.RouterKind.POLYLINE);
      applyEdgeData(family, builder);
      return builder.build();
   }

   protected GNode createMemberNode(final Member member) {
      var header = new GLabelBuilder(WorkflowModelTypes.LABEL_HEADING) //
         .id(member.getId() + "_classname") //
         .text(member.getFirstName()) //
         .build();

      String type = WorkflowModelTypes.MALE_PERSON;

      GNodeBuilder builder = new GNodeBuilder(type);
      builder.id(member.getId());
      builder.addArguments(GArguments.cornerRadius(5));

      applyShapeData(member, builder);
      var finalNode = builder.build();
      finalNode.getChildren().add(header);
      finalNode.getCssClasses().add("parent");
      finalNode.setLayout(GConstants.Layout.HBOX);
      finalNode.getLayoutOptions().put("paddingRight", 10);
      return finalNode;

   }

   protected GNode createNode(final Node node) {
      if (node instanceof Task) {
         return this.createTaskNode(Task.class.cast(node));
      }
      return this.createActivityNode(node);
   }

   protected GNode createFamilyNode(final Family node) {

      var header = new GLabelBuilder(WorkflowModelTypes.LABEL_HEADING) //
         .id(node.getId() + "_classname") //
         .text(node.getLastName()) //
         .build();

      String type = WorkflowModelTypes.MALE_PERSON;

      GNodeBuilder builder = new GNodeBuilder(type);

      builder.addArguments(GArguments.cornerRadius(5));
      builder.id(node.getId());
      applyShapeData(node, builder);
      var finalNode = builder.build();
      finalNode.getChildren().add(header);
      finalNode.getCssClasses().add("task");
      return finalNode;
   }

   protected TaskNode createTaskNode(final Task task) {
      String type = CoffeeTypeUtil.toType(task);
      String nodeType = CoffeeTypeUtil.toNodeType(task);
      TaskNodeBuilder builder = new TaskNodeBuilder(type, task.getName(), nodeType, task.getDuration());
      builder.id(idGenerator.getOrCreateId(task));

      builder.addArguments(GArguments.cornerRadius(5));

      String change = getChangeCssClass(task);
      if (change != null) {
         builder.addCssClass(change);
      }

      applyShapeData(task, builder);
      return builder.build();
   }

   protected ActivityNode createActivityNode(final Node node) {
      String type = CoffeeTypeUtil.toType(node);
      String nodeType = CoffeeTypeUtil.toNodeType(node);
      ActivityNodeBuilder builder = new ActivityNodeBuilder(type, nodeType);
      builder.id(idGenerator.getOrCreateId(node));

      String change = getChangeCssClass(node);
      if (change != null) {
         builder.addCssClass(change);
      }

      applyShapeData(node, builder);
      return builder.build();
   }

   protected GEdge createEdge(final Flow element) {
      if (element instanceof WeightedFlow) {
         return createWeightedFlowEdge((WeightedFlow) element);
      }
      return createFlowEdge(element);
   }

   protected GEdge createFlowEdge(final Flow flow) {
      GEdgeBuilder builder = new GEdgeBuilder()
         .id(idGenerator.getOrCreateId(flow))
         .sourceId(idGenerator.getOrCreateId(flow.getSource()))
         .targetId(idGenerator.getOrCreateId(flow.getTarget()))
         .routerKind(GConstants.RouterKind.POLYLINE);

      String change = getChangeCssClass(flow);
      if (change != null) {
         builder.addCssClass(change);
      }

      applyEdgeData(flow, builder);
      return builder.build();
   }

   protected WeightedEdge createWeightedFlowEdge(final WeightedFlow flow) {
      WeightedEdgeBuilder builder = new WeightedEdgeBuilder()
         .id(idGenerator.getOrCreateId(flow))
         .probability(flow.getProbability().getName())
         .sourceId(idGenerator.getOrCreateId(flow.getSource()))
         .targetId(idGenerator.getOrCreateId(flow.getTarget()))
         .routerKind(GConstants.RouterKind.POLYLINE);

      String change = getChangeCssClass(flow);
      if (change != null) {
         builder.addCssClass(change);
      }

      applyEdgeData(flow, builder);
      return builder.build();
   }

   @SuppressWarnings({ "rawtypes", "unchecked" })
   protected AbstractGNodeBuilder applyShapeData(final EObject shapeElement, final AbstractGNodeBuilder builder) {
      modelState.getIndex().getNotation(shapeElement, Shape.class)
         .ifPresent(shape -> {
            Optional.ofNullable(shape.getPosition()).map(GraphUtil::copy).ifPresent(builder::position);
            Optional.ofNullable(shape.getSize()).map(GraphUtil::copy).ifPresent(newSize -> {
               builder.size(newSize);
               builder.addLayoutOptions(Map.of(
                  GLayoutOptions.KEY_PREF_WIDTH, newSize.getWidth(),
                  GLayoutOptions.KEY_PREF_HEIGHT, newSize.getHeight()));
            });
         });
      return builder;
   }

   @SuppressWarnings("rawtypes")
   protected AbstractGEdgeBuilder applyEdgeData(final EObject edgeElement, final AbstractGEdgeBuilder builder) {
      modelState.getIndex().getNotation(edgeElement, Edge.class)
         .ifPresent(edge -> {
            if (edge.getBendPoints() != null) {
               edge.getBendPoints().stream().map(GraphUtil::copy).forEachOrdered(builder::addRoutingPoint);
            }
         });
      return builder;
   }

}
