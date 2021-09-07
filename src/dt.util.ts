import { utils, WorkSheet, WorkBook, writeFile } from 'xlsx';
import Fuse from 'fuse.js';
import type {TableData, TableRequestParams} from ".";


function dig(obj: any, selector: string) {
    let result = obj;
    const splitter = selector.split('.');

    for (let i = 0; i < splitter.length; i++) {
        if (result == undefined)
            return undefined;
        result = result[splitter[i]];
    }

    return result;
}

export function collect(obj: any, field: any) {
    if (typeof (field) === 'function')
        return field(obj);
    else if (typeof (field) === 'string')
        return dig(obj, field);
    else
        return undefined;
}

export function getPageNumberFromUrl(): number {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get('id') ?? 0);
}

export function getParamsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let entries = params.entries();

    let result: any[] = [];
    for(let entry of entries) {
        const [key, val] = entry;
        // @ts-ignore
        result[key] = decodeURIComponent(val);
    }

    return result;
}

export function paginationRange(c: number, m: number) {
    let current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l: number;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        // @ts-ignore
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

export function printDT(element: any, title?: string) {
    let win = window.open(title ?? 'Page');
    win?.document.write(element.outerHTML);
    win?.print();
    win?.close();
    // const d = new Date();
    // element.id = `${d.getTime()}`;
    // printJS({ printable: element.id, type: 'html', header: title });
}

export function exportExcel(element: any, title?: string) {
    // const ws: WorkSheet = utils.table_to_sheet(element);
    // const wb: WorkBook = utils.book_new();
    // utils.book_append_sheet(wb, ws, title ?? 'Sheet1');
    //
    // writeFile(wb, `${title ?? 'table_export'}.xlsx`);
}

export function exportCsv(element: any, title: string) {
    // const ws: WorkSheet = utils.table_to_sheet(element);
    // const wb: WorkBook = utils.book_new();
    // utils.book_append_sheet(wb, ws, title ?? 'Sheet1');
    //
    // writeFile(wb, `${title ?? 'table_export'}.csv`);
}










export async function dtData<T>(data: any, params: TableRequestParams): Promise<TableData<T[]>> {
    // TODO: Implement method
    const dtDataClass = new DatatableLocalPagination<T>(data, params);
    return dtDataClass.dataResponse;
}

/**
 * Recepta datos en bruto para simular la distribución de datos que
 * Laravel retorna
 */
export class DatatableLocalPagination<T> {
    pagination: any = {};
    items: T[];
    params: TableRequestParams;

    constructor(data: any, params: TableRequestParams) {
        this.items = data;
        this.params = params;
    }

    handleData() {
        this.pagination.total = this.items.length;
        this.pagination.perpage = this.params.perpage;
        this.pagination.pages = Math.ceil(this.pagination.total / this.pagination.perpage);
        this.pagination.page = (this.params.page <= this.pagination.pages) ? this.params.page : this.pagination.pages;
        this.pagination.pointer = Math.max(0, (this.pagination.page * this.pagination.perpage) - this.pagination.perpage);
        this.pagination.from = (this.pagination.pointer >= 0 && this.pagination.total > 0) ? (this.pagination.pointer + 1) : 0;
        this.pagination.diff = this.pagination.perpage - (this.pagination.total % this.pagination.perpage);
        console.log(this.pagination);
    }

    search() {
        // Get key rows
        const copyItems = this.items;
        if (copyItems.length > 0) {
            const row = copyItems[0];

            const keyword = this.params.search?.trim().toLowerCase();
            if (keyword !== undefined && keyword.length > 0) {
                const fuse = new Fuse(copyItems, {
                    threshold: 0,
                    distance: 0,
                    keys: Object.keys(row),
                });

                const result = fuse.search<T>(keyword);
                if (result.length > 0) {
                    this.items = result.map((item: any) => {
                        return item.item;
                    });
                } else {
                    this.items = [];
                }
            }
        }
    }

    sort() {
        const copyItems = this.items;
        if (copyItems.length > 0) {
            const params = (this.params.sort).split(':');
            const key = params[0];
            const ord = params[1];

            if (ord === 'asc') {
                copyItems.sort((a, b) => {
                    // @ts-ignore
                    if (typeof a[key] == 'number') {
                        // @ts-ignore
                        return a[key] - b[key];
                    }
                    // @ts-ignore
                    return a[key].localeCompare(b[key]);
                });
            } else {
                copyItems.sort((a, b) => {
                    // @ts-ignore
                    if (typeof b[key] == 'number') {
                        // @ts-ignore
                        return b[key] - a[key];
                    }
                    // @ts-ignore
                    return b[key].localeCompare(a[key]);
                });
            }
        }
    }

    get rows(): T[] {
        const { pointer, total } = this.pagination;
        const limit = this.pagination.page * this.pagination.perpage;

        let rows: T[] = [];
        let crow = 0;
        for (let i: number = pointer; i < limit; i++) {
            if (i === total) break;
            if (this.items[i] !== undefined) {
                rows.push(this.items[i]);
                crow++;
            }
        }

        this.pagination.to = pointer + crow;

        return rows;
    }

    get dataResponse(): TableData<T[]> {
        this.search();
        this.sort();
        this.handleData();

        const dummyUrl = 'https://host.api/?page=';

        const next = (this.pagination.page) <= this.pagination.pages
            ? `${dummyUrl}${(this.pagination.page + 1)}`
            : null;

        const prev = (this.pagination.page - 1) >= 1
            ? `${dummyUrl}${(this.pagination.page - 1)}`
            : null;

        return {
            current_page: this.pagination.page,
            data: this.rows,
            first_page_url: `${dummyUrl}1`,
            from: this.pagination.from,
            last_page: this.pagination.pages,
            last_page_url: `${dummyUrl}${this.pagination.pages}`,
            next_page_url: next,
            path: '', // Innesary
            per_page: this.pagination.perpage,
            prev_page_url: prev,
            to: this.pagination.to,
            total: this.pagination.total,
        }
    }
}