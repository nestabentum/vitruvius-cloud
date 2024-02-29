import { injectable } from '@theia/core/shared/inversify';

export interface ViewIdCacheContribution {
    getViewId(modelId: string): string | undefined;
}

export const ViewIdCacheContribution = Symbol('ViewIdCacheContribution');
@injectable()
export class ViewCache implements ViewIdCacheContribution {
    private table: Map<string, string> = new Map();

    public add(modelId: string, viewId: string) {
        this.table.set(modelId, viewId);
    }

    public getViewId(modelId: string): string | undefined {
        return this.table.get(modelId);
    }
}
