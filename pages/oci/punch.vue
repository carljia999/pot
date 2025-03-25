<template>
  <div>
    <h1 class="text-3xl text-center font-bold">Response</h1>
    <div>
      <div v-if="form['oci-redirectUrl']">
        <h3 class="text-xl font-bold my-4">Success!</h3>
        <NuxtLink :href="form['oci-redirectUrl']" class="text-l underline">Proceed to {{ form['oci-redirectUrl'] }}</NuxtLink>
      </div>
      <div v-else>
        <p>No response available</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const form = useMyFormData();
</script>

<style scoped>
</style>
