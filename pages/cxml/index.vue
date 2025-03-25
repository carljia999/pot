<template>
  <div class="bg-gray-100 p-4 flex gap-4">
    <Panel header="Punch Out Test - cXML">
      <CxmlPunchoutForm/>
    </Panel>
    <Panel header="Saved Profiles" class="flex-grow">
      <ProfileList type="cxml"/>
    </Panel>
  </div>
</template>
