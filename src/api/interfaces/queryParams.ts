export interface PaginationQuery {
  take?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export type QueryParams = PaginationQuery & {
  [key: string]: string | number | boolean | undefined;
};

export interface RelationParams extends PaginationQuery{
    relations: boolean;
}