<template>
  <div>
    <h1 class="text-3xl text-center font-bold">Callback</h1>
    <div v-if="cxml">
      <h3 class="text-l font-bold my-4">cXML Response</h3>
      <Accordion :value="['1']" multiple>
        <AccordionPanel value="1">
            <AccordionHeader>cXML Viewer</AccordionHeader>
            <AccordionContent>
              <ClientOnly>
                <XmlViewer :xml="cxml.replace(/<!DOCTYPE[^>]+>/,'')"/>
                <template #fallback>
                  <div>Loading...</div>
                </template>
              </ClientOnly>
            </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
            <AccordionHeader>Raw cXML</AccordionHeader>
            <AccordionContent>
              <pre>{{ cxml }}</pre>
            </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <h3 class="text-l font-bold my-4">POST Data</h3>
      <ul>
        <li v-for="(value, key) in form" :key="key">
          <pre>{{ key }}: {{ encodeURIComponent(value) }}</pre>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No response available</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isMethod, readFormData } from 'h3';

// Store in useState for components to access
const form = useState<MyFormData>('form-data', () => ({}));
const cxml = ref('');

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

onMounted(() => {
  // Check if cXML is available
  if (form.value['cXML-URLencoded']) {
    cxml.value = decodeURIComponent(form.value['cXML-URLencoded'])
  }
})
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
}
</style>