<template>
  <div>
    <h1 class="text-3xl text-center font-bold">Callback</h1>
    <h2 class="text-l font-bold my-4">POST Data</h2>
    <pre v-for="([key, value], index) in Object.entries(form)" :key="index">{{ key }} : {{ value }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { isMethod, readFormData } from 'h3';

// Store in useState for components to access
const form = useState<MyFormData>('form-data', () => ({}));

const event = useRequestEvent()

if (event && isMethod(event, 'POST')) {
  const formData = await readFormData(event)
  // Process form data
  const processedData: MyFormData = {}
  for(const [name, value] of formData.entries()) {
    processedData[name] = value.toString()
  }
  form.value = processedData
}
</script>

<style scoped>
/* Add any styles specific to this component here */
pre {
  background-color: #f4f4f4;
  padding: 0 10px;
  border-radius: 5px;
}
</style>