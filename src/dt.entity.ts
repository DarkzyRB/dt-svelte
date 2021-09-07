/*
 * @File: dt.entity.ts
 * @Project: dt-svelte
 * @Author: Paul Salcedo F.
 * @Date: Saturday, 8th May 2021 06:21 pm
 * @Email:  paulsalcedo.dev@gmail.com
 * @Last modified by:   Paul Salcedo F.
 * @Last modified time: Saturday, 8th May 2021 06:15 pm
 * @License: Privativo
 * @Copyright: Copyright (c) 2021 Paul Salcedo F.
 */




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