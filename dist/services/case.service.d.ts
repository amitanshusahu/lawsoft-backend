export declare function createCase(data: {
    clientId: string;
    title: string;
    description?: string;
    category?: string;
    courtName?: string;
}): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    category: string;
    caseNumber: string | null;
    courtName: string | null;
    status: import("@prisma/client").$Enums.CaseStatus;
    clientId: string;
    lawyerId: string | null;
    startedAt: Date | null;
    closedAt: Date | null;
}>;
export declare function listForUser(userId: string, role: string): Promise<({
    documents: {
        url: string;
        caseId: string | null;
        id: string;
        version: number;
        uploaderId: string;
        filename: string;
        mimeType: string;
        size: number;
        uploadedAt: Date;
    }[];
    hearings: {
        caseId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        date: Date;
        court: string | null;
        judge: string | null;
        purpose: string;
        outcome: string | null;
    }[];
    timeline: {
        caseId: string;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        eventDate: Date;
        type: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    category: string;
    caseNumber: string | null;
    courtName: string | null;
    status: import("@prisma/client").$Enums.CaseStatus;
    clientId: string;
    lawyerId: string | null;
    startedAt: Date | null;
    closedAt: Date | null;
})[]>;
export declare function getById(id: string): Promise<({
    chat: {
        caseId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    documents: {
        url: string;
        caseId: string | null;
        id: string;
        version: number;
        uploaderId: string;
        filename: string;
        mimeType: string;
        size: number;
        uploadedAt: Date;
    }[];
    hearings: {
        caseId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        date: Date;
        court: string | null;
        judge: string | null;
        purpose: string;
        outcome: string | null;
    }[];
    timeline: {
        caseId: string;
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        eventDate: Date;
        type: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    category: string;
    caseNumber: string | null;
    courtName: string | null;
    status: import("@prisma/client").$Enums.CaseStatus;
    clientId: string;
    lawyerId: string | null;
    startedAt: Date | null;
    closedAt: Date | null;
}) | null>;
export declare function updateCase(id: string, data: any): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    category: string;
    caseNumber: string | null;
    courtName: string | null;
    status: import("@prisma/client").$Enums.CaseStatus;
    clientId: string;
    lawyerId: string | null;
    startedAt: Date | null;
    closedAt: Date | null;
}>;
export declare function addDocument(caseId: string, uploaderId: string, doc: {
    fileurl: string;
    fileName: string;
    mimeType: string;
    size?: number;
}): Promise<{
    url: string;
    caseId: string | null;
    id: string;
    version: number;
    uploaderId: string;
    filename: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
}>;
export declare function listDocuments(caseId: string): Promise<{
    url: string;
    caseId: string | null;
    id: string;
    version: number;
    uploaderId: string;
    filename: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
}[]>;
export declare function addTimelineEvent(caseId: string, data: {
    title: string;
    description?: string;
    eventDate: Date;
    type?: string;
}): Promise<{
    caseId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    eventDate: Date;
    type: string;
}>;
export declare function addHearing(caseId: string, data: {
    date: Date;
    court?: string;
    judge?: string;
    purpose?: string;
    notes?: string;
}): Promise<{
    caseId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    notes: string | null;
    date: Date;
    court: string | null;
    judge: string | null;
    purpose: string;
    outcome: string | null;
}>;
declare const _default: {
    createCase: typeof createCase;
    listForUser: typeof listForUser;
    getById: typeof getById;
    updateCase: typeof updateCase;
    addDocument: typeof addDocument;
    listDocuments: typeof listDocuments;
    addTimelineEvent: typeof addTimelineEvent;
    addHearing: typeof addHearing;
};
export default _default;
//# sourceMappingURL=case.service.d.ts.map