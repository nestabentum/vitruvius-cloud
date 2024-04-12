import { injectable } from '@theia/core/shared/inversify';

export interface ViewIdCacheContribution {
    getViewId(modelId: string): string | undefined;
}

export const ViewIdCacheContribution = Symbol('ViewIdCacheContribution');
@injectable()
export class ViewIdCache {
    private static viewToId: Map<string, { id: string; resourceURI: string }> = new Map();

    public static add(modelId: string, viewInfo: { id: string; resourceURI: string }) {
        this.viewToId.set(modelId, viewInfo);
    }
    public static getViewInfo(modelId: string): { id: string; resourceURI: string } | undefined {
        return this.viewToId.get(modelId);
    }
}
