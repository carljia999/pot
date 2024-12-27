<template>
    <header class="header">
        <Toolbar pt:center:class="gap-2">
            <template #start>
                <i class="pi pi-shop text-xl"/>
            </template>

            <template #center>
                <h1 class="text-xl font-bold">Punch Out Test</h1>
                <NuxtLink href="/cxml">
                    <i class="pi pi-shop">cxml</i>
                </NuxtLink>
                <NuxtLink href="/oci">
                    <i class="pi pi-shop">oci</i>
                </NuxtLink>
            </template>
        </Toolbar>
    </header>
</template>