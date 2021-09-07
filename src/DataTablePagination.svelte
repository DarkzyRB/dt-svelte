<script lang="ts">
    import type { TableData } from ".";
    import { getPageNumberFromUrl, paginationRange } from '.';


    export let showPreload: boolean = false;
    export let paginationData: TableData<any>|undefined;
    export let firePage: number;

    function goTo(page: number) {
        firePage = page;
    }

    const btnClass = 'btn btn-white';
</script>

<div class="row mt-1 mb-1">
    <div class="col-md-6 col-12">
        {#if showPreload}
            <small><li class="fa fa-spinner fa-spin"></li> Cargando datos</small>
        {:else}
            <small>Mostrando registros del {paginationData.from ?? 0} al {paginationData.to ?? 0} de un total de <strong>{paginationData.total ?? 0}</strong></small>
        {/if}
    </div>
    <div class="col-md-6 col-12">
        <div class="float-md-right">
            <div class="btn-group btn-group-sm">
                <button type="button" class={btnClass} on:click={
                ()=>goTo(1)}>
                    <i class="fa fa-angle-double-left"></i>
                </button>

                {#if paginationData.prev_page_url !== null}
                    <button type="button" class={btnClass} on:click={
                    ()=>goTo(getPageNumberFromUrl(paginationData.prev_page_url))}>
                        <i class="fa fa-chevron-left"></i></button>
                {:else}
                    <button type="button" class={btnClass}><i class="fa fa-chevron-left"></i></button>
                {/if}

                {#each paginationRange(paginationData.current_page, paginationData.last_page) as p}
                    {#if typeof (p) === 'number'}
                        <button
                                class="btn btn-white {p===paginationData.current_page ? 'active' : ''}"
                                on:click={()=>goTo(p)}
                        >
                            {p}
                        </button>
                    {:else}
                        <button class="btn btn-white">
                            {p}
                        </button>
                    {/if}
                {/each}

                {#if paginationData.next_page_url !== null}
                    <button type="button" class={btnClass} on:click={
                    ()=>goTo(getPageNumberFromUrl(paginationData.next_page_url))}>
                        <i class="fa fa-chevron-right"></i>
                    </button>
                {:else}
                    <button type="button" class={btnClass}><i class="fa fa-chevron-right"></i></button>
                {/if}

                <button type="button" class={btnClass} on:click={
                ()=>goTo(paginationData.last_page)}>
                    <i class="fa fa-angle-double-right"></i>
                </button>
            </div>
        </div>
    </div>
</div>