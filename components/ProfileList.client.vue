<template>
    <div class="grid gap-4 container">
        <Card v-for="[id, profile] in profileStore.profiles" :key="id" style="overflow: hidden">
            <template #header>
                <img alt="user header" src="https://demofree.sirv.com/nope-not-here.jpg?w=150" />
            </template>
            <template #title>{{ profile.name }}</template>
            <template #subtitle>{{ profile.id }}</template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button label="Punch Out" class="w-full" />
                    <Button icon="pi pi-times" severity="danger" class="p-button-sm"
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
div.container {
    grid-template-columns: repeat(auto-fill, 15rem);
}
</style>