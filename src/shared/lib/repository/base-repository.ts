export type Identifier = number;

export interface Repository<T extends { id?: Identifier }> {
    add(entity: Omit<T, 'id'>): Promise<Identifier>;
    update(id: Identifier, updates: Partial<T>): Promise<void>;
    remove(id: Identifier): Promise<void>;
    getById(id: Identifier): Promise<T | undefined>;
    getAll(): Promise<T[]>;
}
