<template>
  <div>
    <h1>OCI Punch Out Test</h1>
    <PunchoutForm @submit="handleSubmit" />
  </div>
</template>

<script lang="ts">
import PunchoutForm from '@/components/PunchoutForm.vue';

export default {
  components: {
    PunchoutForm,
  },
  methods: {
    handleSubmit(formData: { punchoutUrl: string; username: string; password: string }) {
      // Handle form submission logic here
      // You can call the API endpoint for OCI punchout with formData
    },
  },
};
</script>

<style scoped>
/* Add any specific styles for this page here */
</style>