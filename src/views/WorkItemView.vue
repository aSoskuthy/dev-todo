<template>
<div>  
  <work-item-edit :item="item" />
</div>
</template>

<script>
import WorkItemEdit from '@/components/WorkItemEdit.vue'
// @ is an alias to /src

export default {
  props: ['item'],    
  components: {
    WorkItemEdit
  }, 
  
}
</script>
