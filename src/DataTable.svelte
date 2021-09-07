<script lang="ts">
    import type { TableData, TableRequestParams } from ".";
    import { exportCsv, exportExcel, printDT } from ".";
    import DataTablePagination from './DataTablePagination.svelte';


    //
    // ! Exports data
    export let paginationData: TableData<any>|undefined;
    export let showTools: boolean = true;
    export let showPreload: boolean = false;

    export let perPage: number;
    export let perPageOptions = [20, 50, 100];

    //
    // ! Binds
    export let paramsRequest: TableRequestParams;


    //
    // ! Local variables
    let tableElement: any;
    let sortType: string = 'asc';
    let sortField: string = 'id';
    let currentPage: number = 1;

    let searchKey: string = '';


    //
    // ! Funtions
    function sort(key: string) {
        if (sortField === String(key)) {
            sortType = sortType === 'asc' ? 'desc' : 'asc';
        } else {
            sortType = 'asc';
        }
        sortField = String(key);
        updateDataParams();
    }

    function updateDataParams() {
        paramsRequest = {
            page: currentPage,
            perpage: perPage,
            sort: `${sortField}:${sortType}`,
            search: searchKey
        };
    }

    let prevCurrentPage: number;
    $: if (currentPage && currentPage !== prevCurrentPage) {
        if (prevCurrentPage) {
            console.log(`prevCurrentPage: ${prevCurrentPage} ${currentPage}`);
            updateDataParams();
        }
        prevCurrentPage = currentPage;
    }

    let prevPerPage: number;
    $: if(perPage &&  perPage !== prevPerPage) {
        if (prevPerPage) {
            console.log(`prevPerPage: ${prevPerPage} ${perPage}`);
            updateDataParams();
        }
        prevPerPage = perPage;
    }

    let prevSearchKey: string;
    $: if (searchKey !== undefined && searchKey !== prevSearchKey) {
        if (prevSearchKey) {
            console.log(`prevSearchKey: ${prevSearchKey} ${searchKey}`);
            updateDataParams();
        }
        prevSearchKey = searchKey;
    }


    //
    // ! Get Columns and set atrrs
    $: if(tableElement !== undefined) {
        tableElement.querySelectorAll('thead tr th').forEach((td: any) => {
            const sortable = (td.dataset.unsortable ?? true);
            td.removeEventListener('click', () => {}, false);
            if (sortable) {
                td.classList.add('cdt_sortable');
                td.addEventListener('click', () => {
                    sort(td.dataset.key);
                }, false);
            }
        });
    }



    //
    // ! Tools functions
    function printTable() {
        if(tableElement !== undefined) printDT(tableElement, `Page ${currentPage}`);
    }

    function exportExcelPage() {
        if(tableElement !== undefined) exportExcel(tableElement, `page_${currentPage}`);
    }

    function exportCsvPage() {
        if(tableElement !== undefined) exportCsv(tableElement, `page_${currentPage}`);
    }
</script>




<div class="row mt-1 mb-3">
    <div class="col-md-3 col-12">
        {#if paginationData !== undefined}
            <div class="input-group input-group-sm" style="width:200px !important;">
                <div class="input-group-prepend">
                    <div class="input-group-text bg-white"><small>Mostrar</small></div>
                </div>
                <select class="form-control" bind:value={perPage}>
                    {#each perPageOptions as option}
                        <option value={option}>{option}</option>
                    {/each}
                </select>
                <div class="input-group-append">
                    <div class="input-group-text bg-white"><small>por página</small></div>
                </div>
            </div>
        {/if}
    </div>
    <div class="col-md-9 col-12">
        {#if showTools}
            <div class="float-md-right">
                <div class="btn-toolbar btn-toolbar-sm" role="toolbar">
                    <div class="input-group input-group-sm">
                        <input
                                type="text"
                                class="form-control"
                                placeholder="Buscar"
                                bind:value={searchKey}
                                on:keyup={e=>{ if (e.key === 'Escape') searchKey = ''; }}
                        >
                    </div>
                    <div class="btn-group btn-group-sm ml-1">
                        <button class="btn btn-white btn-sm" on:click={printTable}><li class="fa fa-print"></li> Print</button>
                        <button class="btn btn-white btn-sm" on:click={exportCsvPage} ><li class="fa fa-file-csv"></li> Csv</button>
                        <button class="btn btn-white btn-sm" on:click={exportExcelPage} ><li class="fa fa-file-excel-o"></li> Excel</button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>



{#if paginationData !== undefined}
    <DataTablePagination {paginationData} bind:firePage={currentPage} showPreload={showPreload} />
{:else}
    <div class="row mt-1 mb-1">
        <div class="col-md-6 col-12">
            {#if showPreload}
                <small><li class="fa fa-spinner fa-spin"></li> Cargando datos</small>
            {/if}
        </div>
    </div>
{/if}

<div class="table-responsive">
    <table class="table table-striped table-hover table-bordered cdt" bind:this={tableElement}>
        <slot />
    </table>
</div>

{#if paginationData !== undefined}
    <DataTablePagination {paginationData} bind:firePage={currentPage} showPreload={showPreload} />
{/if}