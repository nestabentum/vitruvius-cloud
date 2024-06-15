/**
 * Generated using theia-extension-generator
 */
import { CommandContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
import { VitruviusCloudCommandContribution, } from './vitruvius-cloud-contribution';
import { ViewSaver } from '../util/viewSaver';
import { UpdateViewCommandContribution } from './update-view-contribution';
import { CommitViewCommandContribution, ProgressCount } from './commit-view-command-contribution';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    console.log('registering vitruvius-cloud extension');
    bind(CommandContribution).to(VitruviusCloudCommandContribution);
    bind(CommandContribution).to(UpdateViewCommandContribution)
    bind(CommandContribution).to(CommitViewCommandContribution)
    bind(ProgressCount).toSelf().inSingletonScope()
    bind(ViewSaver).toSelf();
});
