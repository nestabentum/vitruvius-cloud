/**
 * Generated using theia-extension-generator
 */
import { VitruviusCloudCommandContribution, VitruviusCloudMenuContribution } from './vitruvius-cloud-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ViewSaver } from '../util/viewSaver';


export default new ContainerModule(bind => {
    // add your contribution bindings here
    console.log('registering vitruvius-cloud extension')
    bind(CommandContribution).to(VitruviusCloudCommandContribution);
    bind(MenuContribution).to(VitruviusCloudMenuContribution);

    bind(ViewSaver).toSelf()
});
