<template>
    <div class="bg-gray-100 p-4">
        <Panel header="Punch Out Test - cXML">
            <form id="myForm" method="post" enctype="multipart/form-data">
                <label for="name">Name:</label>
                <input id="name" type="text" name="name">

                <label for="favorite-food">Favorite food:</label>
                <input id="favorite-food" type="text" name="favorite-food">

                <input type="submit" value="Submit">
            </form>
        </Panel>
        <Panel header="Punch Out Test - output">            
            <label for="name">Name:</label>
            <div> {{ name }}</div>

            <label for="favorite-food">Favorite food:</label>
            <div> {{ food }}</div>
        </Panel>
    </div>
</template>

<script lang="ts" setup>
import { isMethod, readBody } from 'h3';

const name = useState<string>('name', () => '');
const food = useState<string>('food', () => '');
const event = useRequestEvent()
if (event && isMethod(event, 'POST')) {
  /*const formData = await readFormData(event)
  name.value = formData.get('name')?.toString() || ''
  food.value = formData.get('favorite-food')?.toString() || ''*/
  const body = await readBody(event);
  name.value = JSON.stringify(body);
}
</script>