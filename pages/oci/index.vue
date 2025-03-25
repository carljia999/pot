<template>
  <div class="bg-gray-100 p-4 flex gap-4">
    <Panel header="Punch Out Test - OCI">
      <OCIPunchoutForm/>
    </Panel>
    <Panel header="Saved Profiles" class="flex-grow">
      <ProfileList type="oci"/>
    </Panel>
  </div>
</template>
