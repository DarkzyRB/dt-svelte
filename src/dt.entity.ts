export interface TableColumnParams {
    label: string | any;
    field: string | any;
    sortable: boolean;
    html: boolean;
}

export interface TableData<DataType> {
    current_page: number;
    data?: DataType;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface TableRequestParams {
    page: number;
    perpage: number;
    sort: string;
    search: string | null;
}