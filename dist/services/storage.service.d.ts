export declare function createPresignedUpload(key: string, contentType?: string, expiresInSec?: number): Promise<{
    uploadUrl: string;
    fileUrl: string;
    method: string;
} | null>;
declare const _default: {
    createPresignedUpload: typeof createPresignedUpload;
};
export default _default;
//# sourceMappingURL=storage.service.d.ts.map