import { injectable } from '@theia/core/shared/inversify';

export interface ViewIdCacheContribution {
    getViewId(modelId: string): string | undefined;
}

export const ViewIdCacheContribution = Symbol('ViewIdCacheContribution');
@injectable()
export class ViewIdCache {
    private static table: Map<string, string> = new Map();

    public static add(modelId: string, viewId: string) {
        this.table.set(modelId, viewId);
    }

    public static getViewId(modelId: string): string  {
        return this.table.get(modelId)?? '';
    }
}
