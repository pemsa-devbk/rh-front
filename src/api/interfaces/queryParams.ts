export interface QueryParams{
    take: number;
    skip: number;
    search?: string;
}

export interface RelationParams extends QueryParams{
    relations: boolean;
}