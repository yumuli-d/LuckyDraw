<script setup>
import { computed } from 'vue'
import { useMainStore } from '@/store/mainStore'

const store = useMainStore()

const winnersList = computed(() => {
  const list = []
  const sortedWinners = [...store.winners].sort((a, b) => b.time - a.time)
  
  sortedWinners.forEach(record => {
    const prize = store.prizes.find(p => p.id === record.prizeId)
    const users = record.userIds.map(uid => store.users.find(u => u.id === uid)).filter(Boolean)
    
    users.forEach(user => {
      list.push({
        id: user.id,
        name: user.name,
        department: user.department,
        prizeName: prize ? prize.name : '未知奖项',
        prizeColor: prize ? prize.color : '#f53f3f',
        time: record.time
      })
    })
  })
  return list
})
</script>

<template>
  <div class="winners-table-container">
    <a-table 
      :data="winnersList" 
      :pagination="{ pageSize: 10 }"
      :scroll="{ y: 400 }"
    >
      <template #columns>
        <a-table-column title="姓名" data-index="name"></a-table-column>
        <a-table-column title="部门" data-index="department"></a-table-column>
        <a-table-column title="奖项" data-index="prizeName">
          <template #cell="{ record }">
            <a-tag :color="record.prizeColor || 'gold'">{{ record.prizeName }}</a-tag>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.winners-table-container {
  padding: 0;
}
</style>
