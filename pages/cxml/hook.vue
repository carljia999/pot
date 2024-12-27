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
import { readBody, readMultipartFormData } from 'h3';
// XmlViewer is not available on the server side
const XmlViewer = defineAsyncComponent(() => 
  import('vue3-xml-viewer')
)
useNuxtApp().provide('XmlViewer', XmlViewer)

const event = useRequestEvent()

// Store in useState for components to access
const form = useState<MyFormData>('form-data', () => ({}));
const cxml = ref('');

if (event) {
  // Check if it's a multipart form request
  const contentType = event.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    const body = await readBody(event) as MyFormData;
    form.value = body
  } else {
    // Read multipart form data
    const formData = await readMultipartFormData(event)
    if (formData) {
      // Process form data
      const processedData: MyFormData = {}

      formData.forEach(part => {
        if (part.name) {
          processedData[part.name] = part.data.toString()
        }
      })
      form.value = processedData
    }
  }
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