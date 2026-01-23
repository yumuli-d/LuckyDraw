<script setup>
import { computed } from 'vue'
import { useMainStore } from '@/store/mainStore'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

const store = useMainStore()

const winnersData = computed(() => {
  const list = []
  // 获取所有批次ID并排序
  const batchIds = [...new Set(store.winners.map(w => w.batchId).filter(Boolean))].sort((a, b) => Number(a) - Number(b))
  
  const getRoundName = (batchId) => {
    if (!batchId) return '历史记录'
    const index = batchIds.indexOf(batchId)
    const cnNums = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    const numStr = index < cnNums.length ? cnNums[index] : (index + 1)
    return `第${numStr}轮`
  }

  // 遍历所有中奖批次
  store.winners.forEach(record => {
    const prize = store.prizes.find(p => p.id === record.prizeId)
    const users = record.userIds.map(uid => store.users.find(u => u.id === uid)).filter(Boolean)
    // 兼容旧数据，如果没有 batchId 则不显示或显示默认值
    const roundInfo = getRoundName(record.batchId)
    
    users.forEach(user => {
      list.push({
        id: user.id,
        round: roundInfo,
        // time: dayjs(record.time).format('YYYY-MM-DD HH:mm:ss'), // 移除时间显示
        name: user.name,
        department: user.department,
        prizeName: prize ? prize.name : '未知奖项'
      })
    })
  })
  
  // 按时间倒序（利用 record.time 或 batchId 排序）
  // 这里 winnersData 是扁平化的，我们尽量保持原 store.winners 的顺序（store.winners 默认是追加，即时间正序，我们想要倒序）
  // 已经在 store.winners.forEach 遍历了，如果想倒序，可以先 reverse store.winners 副本
  return list.reverse() 
})

const columns = [
  // { title: '时间', dataIndex: 'time', width: 180 }, // 移除时间列
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '部门', dataIndex: 'department', width: 120 },
  { title: '奖项', dataIndex: 'prizeName', width: 150 },
  { title: '抽奖批次', dataIndex: 'round', width: 150 }
]

const exportExcel = () => {
  const data = winnersData.value.map(item => ({
    // '时间': item.time, // 移除时间导出
    '姓名': item.name,
    '部门': item.department,
    '奖项': item.prizeName,
    '抽奖批次': item.round
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "中奖明细")
  XLSX.writeFile(wb, `中奖名单_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
}
</script>

<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button type="primary" status="success" @click="exportExcel" :disabled="!winnersData.length">导出 Excel</a-button>
    </div>
    <a-table :data="winnersData" :columns="columns" :pagination="{ pageSize: 10 }" />
  </div>
</template>
