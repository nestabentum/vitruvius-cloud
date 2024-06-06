/*
 * Copyright (c) 2019-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 */
import { LaunchOptions } from '@eclipse-emfcloud/modelserver-theia/lib/node';
import { GLSPServerContribution } from '@eclipse-glsp/theia-integration/lib/node';
// import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common/messaging';
// import { BackendApplicationContribution } from '@theia/core/lib/node';
import { ContainerModule } from '@theia/core/shared/inversify';
// import { JavaCodeGenServer, JAVA_CODEGEN_SERVICE_PATH } from 'coffee-java-extension/lib/common/generate-protocol';

import { WorkflowGLSPServerContribution } from './glsp-server-contribution';
// import { CoffeeJavaCodeGenServer } from './java-codegen-server';
import { WorkflowModelServerLaunchOptions } from './model-server-launch-options';

export default new ContainerModule((bind, _unbind, isBound, rebind) => {
    // Model Server
    console.log('starting');
    if (isBound(LaunchOptions)) {
        console.log('rebinding model server', WorkflowModelServerLaunchOptions);

        rebind(LaunchOptions).to(WorkflowModelServerLaunchOptions).inSingletonScope();
    } else {
        console.log('binding model server', WorkflowModelServerLaunchOptions);

        bind(LaunchOptions).to(WorkflowModelServerLaunchOptions).inSingletonScope();
    }

    // GLSP Server
    bind(WorkflowGLSPServerContribution).toSelf().inSingletonScope();
    bind(GLSPServerContribution).toService(WorkflowGLSPServerContribution);

    // Java Codegen Server
    //  bind(CoffeeJavaCodeGenServer).toSelf().inSingletonScope();
    // bind(BackendApplicationContribution).toService(CoffeeJavaCodeGenServer);
    // bind(ConnectionHandler)
    //  .toDynamicValue(
    //    ctx =>
    //      new JsonRpcConnectionHandler(JAVA_CODEGEN_SERVICE_PATH, () => ctx.container.get<JavaCodeGenServer>(CoffeeJavaCodeGenServer))
    // )
    // .inSingletonScope();
});
