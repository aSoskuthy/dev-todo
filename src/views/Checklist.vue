<template>
<div>  
  <todo-base :item="item" />
</div>
</template>

<script>
import TodoBase from '@/components/TodoBase.vue'
// @ is an alias to /src

export default {
  props: ['item'],
  name: 'checklist',  
  components: {
    TodoBase
  }, 
  
}
</script>
