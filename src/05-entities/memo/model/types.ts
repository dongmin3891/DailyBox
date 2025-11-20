export type Memo = {
    id?: number;
    title: string;
    content: string;
    tags?: string[];
    isPinned?: boolean;
    isArchived?: boolean;
    isLocked?: boolean;
    lockPin?: string;
    createdAt: number;
    updatedAt: number;
};
