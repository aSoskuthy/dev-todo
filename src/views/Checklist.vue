<template>
  <div class="checklist">   
  <Todo-base />
  </div>
</template>

<script>
import TodoBase from '@/components/TodoBase.vue'
// @ is an alias to /src

export default {
  name: 'checklist',
  data() {
    return {
      todos: []
    }
  },
  components: {
    TodoBase
  }
}
</script>
