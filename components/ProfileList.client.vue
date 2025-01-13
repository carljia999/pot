<template>
    <div class="grid gap-4">
        <Card v-for="[id, profile] in profileStore.profiles" :key="id" style="overflow: hidden">
            <template #header>
                <SitePreview site-url="https://www.nxp.nz" />
                <!--<img alt="user header" src="https://demofree.sirv.com/nope-not-here.jpg?w=150" />-->
            </template>
            <template #subtitle>{{ profile.name }}</template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button as="router-link" :to="`/cxml/go?p=${profile.id}`" label="Punch Out" class="w-full" />
                    <Button
                        v-tooltip="'Delete this profile'"
                        icon="pi pi-times" severity="danger" size="small"
                        @click="deleteProfile(profile.id)" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
const toast = useToast();
const profileStore = useProfileStore();
const { loadProfiles } = profileStore

onMounted(loadProfiles);

const deleteProfile = (id: string) => {
    profileStore.deleteProfile(id)
    toast.add({ severity: 'success', summary: 'Profile Deleted', life: 3000 })
}
</script>

<style scoped>
div.grid {
    grid-template-columns: repeat(auto-fill, 15rem);
}
</style>