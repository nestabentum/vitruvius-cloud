/********************************************************************************
 * Copyright (c) 2022-2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { join } from 'path';
import { copyBackendFile, log } from './copy-utils';

const start = new Date(Date.now());

const BACKEND_VERSION = '0.8.0-SNAPSHOT';

// Model Server
const modelServerPath = join(__dirname, '..', '..', '..', 'backend', 'plugins', 'org.eclipse.emfcloud.coffee.modelserver');
const modelServerLogConfigPath = join(modelServerPath, 'log4j2-embedded.xml');
const modelServerExecutable = `org.eclipse.emfcloud.coffee.modelserver-${BACKEND_VERSION}-standalone.jar`;
const modelServerJarPath = join(modelServerPath, 'target', modelServerExecutable);

// GLSP Server
const glspServerPath = join(__dirname, '..', '..', '..', 'backend', 'plugins', 'org.eclipse.emfcloud.coffee.workflow.glsp.server');
const glspServerExecutable = `org.eclipse.emfcloud.coffee.workflow.glsp.server-${BACKEND_VERSION}-glsp.jar`;
const glspServerJarPath = join(glspServerPath, 'target', glspServerExecutable);

const targetDir = join(__dirname, '..', 'servers');

log('Start copying Model Server JAR..');
copyBackendFile(modelServerJarPath, targetDir, modelServerExecutable);

log('Start copying Model Server log4j2 config..');
copyBackendFile(modelServerLogConfigPath, targetDir, 'model-server-log4j2-embedded.xml');

log('Start copying GLSP Server JAR..');
copyBackendFile(glspServerJarPath, targetDir, glspServerExecutable);


const end = new Date(Date.now());
const elapsedTime = (end.getTime() - start.getTime()) / 1000;
log('Done in ' + elapsedTime + 's.');
