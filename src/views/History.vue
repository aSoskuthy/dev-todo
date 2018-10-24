<template>
<div>   
<history-table />
</div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable.vue'
// @ is an alias to /src

export default {
  name: 'history',  
  components: {
    HistoryTable
  }
}
</script>