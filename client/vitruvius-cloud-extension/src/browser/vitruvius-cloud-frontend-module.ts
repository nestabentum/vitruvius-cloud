/**
 * Generated using theia-extension-generator
 */
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ViewCache } from '../ViewIdCache';
import { VitruviusCloudCommandContribution, VitruviusCloudMenuContribution } from './vitruvius-cloud-contribution';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    console.log('registering vitruvius-cloud extension');
    bind(CommandContribution).to(VitruviusCloudCommandContribution);
    bind(MenuContribution).to(VitruviusCloudMenuContribution);
    bind(ViewCache).toSelf();
});
