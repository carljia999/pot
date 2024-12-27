<template>
  <div>
    <h1 class="text-3xl text-center font-bold">Response</h1>
    <div>
      <div v-if="form.cXML">
        <div v-if="success">
          <h3 class="text-xl font-bold my-4">Success!</h3>
          <NuxtLink :href="url" class="text-l underline">Proceed to {{ url }}</NuxtLink>
        </div>
        <h3 class="text-l font-bold my-4">cXML Response:</h3>
        <Accordion :value="['1']" multiple>
          <AccordionPanel value="1">
              <AccordionHeader>cXML Viewer</AccordionHeader>
              <AccordionContent>
                <XmlViewer :xml="xml" />
              </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2">
              <AccordionHeader>Raw cXML</AccordionHeader>
              <AccordionContent>
                <pre>{{ form.cXML }}</pre>
              </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
      <div v-else>
        <p>No response available</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import XmlViewer from 'vue3-xml-viewer';
import * as xml2js from 'xml2js';
const parser = new xml2js.Parser({explicitArray: false});

const form = useMyFormData();
const xml = useState("cXML", () => form.value['cXML'].replace(/<!DOCTYPE[^>]+>/,""));
const success = useState<boolean>('Success')
const url = useState<string>('StartingURL')

parser.parseString(xml.value, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  success.value = result.cXML.Response.Status.$.code === '200'
  if (success.value)
    url.value = result.cXML.Response.PunchOutSetupResponse.StartPage.URL
});

</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 5px;
}
</style>
