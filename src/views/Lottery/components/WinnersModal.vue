<script setup>
/**
 * 中奖名单弹窗组件
 * 展示所有中奖人员，支持按奖项分组展示和导出 Excel
 */
import { computed } from 'vue'
import { useMainStore } from '@/store/mainStore'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

const store = useMainStore()

/**
 * 按奖项分组的中奖数据
 * 包含所有奖项，即使还没有人中奖
 */
const winnersGroupedByPrize = computed(() => {
  const groups = []
  
  // 遍历所有奖项
  store.prizes.forEach(prize => {
    // 找出该奖项的所有中奖记录
    const prizeWinners = []
    store.winners.forEach(record => {
      if (record.prizeId === prize.id) {
        const users = record.userIds.map(uid => store.users.find(u => u.id === uid)).filter(Boolean)
        users.forEach(user => {
          prizeWinners.push({
            name: user.name,
            number: user.number,
            department: user.department,
            prizeName: prize.name
          })
        })
      }
    })
    
    // 即使没有中奖人员，也列出奖项
    groups.push({
      prizeId: prize.id,
      prizeName: prize.name,
      prizeColor: prize.color,
      winners: prizeWinners
    })
  })
  
  return groups
})

/**
 * 导出 Excel 功能
 * 导出字段：姓名、工号、部门、奖项
 */
const exportExcel = () => {
  const exportData = []
  winnersGroupedByPrize.value.forEach(group => {
    group.winners.forEach(winner => {
      exportData.push({
        '姓名': winner.name,
        '工号': winner.number,
        '部门': winner.department,
        '奖项': winner.prizeName
      })
    })
  })
  
  if (exportData.length === 0) return
  
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "中奖名单")
  XLSX.writeFile(wb, `中奖名单_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
}
</script>

<template>
  <div class="winners-modal-content">
    <div class="modal-header">
      <a-button type="primary" status="success" @click="exportExcel" :disabled="store.winners.length === 0">
        导出 Excel
      </a-button>
    </div>
    
    <div class="winners-groups">
      <div v-for="group in winnersGroupedByPrize" :key="group.prizeId" class="prize-group">
        <a-divider orientation="left">
          <a-tag :color="group.prizeColor" size="large">{{ group.prizeName }}</a-tag>
        </a-divider>
        
        <div class="winners-grid-wrapper">
          <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }" :colGap="16" :rowGap="16" v-if="group.winners.length > 0">
            <a-grid-item v-for="(winner, wIndex) in group.winners" :key="wIndex">
              <a-card hoverable class="winner-comment-card">
                <a-comment
                  :author="winner.name"
                  :content="winner.department"
                  :datetime="winner.number"
                >
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: group.prizeColor }">
                      {{ winner.name[0] }}
                    </a-avatar>
                  </template>
                </a-comment>
              </a-card>
            </a-grid-item>
          </a-grid>
          <div v-else class="prize-empty-tip">
            <a-typography-text type="secondary">暂无中奖人员</a-typography-text>
          </div>
        </div>
      </div>
      
      <div v-if="store.prizes.length === 0" class="empty-tip">
        <a-empty description="暂无奖项配置" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.winners-modal-content {
  padding: 0 20px 20px 0;
  height: 100%;
  overflow-y: auto;
}

.modal-header {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
}

.prize-group {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.winners-grid-wrapper {
  padding: 10px 0;
}

.winner-comment-card {
  border-radius: 8px;
  transition: all 0.3s;
}

.prize-empty-tip {
  text-align: center;
  padding: 20px;
  background-color: var(--color-fill-2);
  border-radius: 4px;
}

.empty-tip {
  padding: 100px 0;
}

:deep(.arco-comment-content) {
  color: var(--color-text-2);
  font-size: 13px;
}

:deep(.arco-comment-datetime) {
  font-size: 12px;
}
</style>
