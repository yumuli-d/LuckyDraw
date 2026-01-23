<script setup>
import { ref, computed, onMounted, onUnmounted, h, defineAsyncComponent } from 'vue'
import { useMainStore } from '@/store/mainStore'
import confetti from 'canvas-confetti'
import { IconSettings, IconTrophy } from '@arco-design/web-vue/es/icon'
import { Modal } from '@arco-design/web-vue'

const WinnersModal = defineAsyncComponent(() => import('./components/WinnersModal.vue'))

const store = useMainStore()

// --- 状态 ---
const isRolling = ref(false)
const showWinnerModal = ref(false)
const currentWinners = ref([]) // 本轮中奖者
const drawCount = ref(5) // 默认每次抽5人

// --- 奖项统计 ---
const totalPrizes = computed(() => store.prizes.reduce((sum, p) => sum + p.count, 0))
const remainPrizes = computed(() => store.prizes.reduce((sum, p) => sum + (p.count - p.drawn), 0))
const isAllFinished = computed(() => remainPrizes.value <= 0)

// 自动跳转逻辑移除，改为混合模式不需要定位特定奖项

// --- 中奖名单数据 ---
const winnersList = computed(() => {
  // 展平所有中奖记录
  const list = []
  // 按时间倒序遍历中奖批次
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

const openWinnersModal = () => {
  Modal.open({
    title: '所有中奖名单',
    width: '800px',
    footer: false,
    content: () => h(WinnersModal)
  })
}

// --- 滚动动画 ---
const displayUsers = ref([]) // 当前展示在屏幕上的用户
let timer = null

const startRolling = () => {
  if (!store.users.length) {
    alert('暂无人员数据，请先到管理后台导入！')
    return
  }
  // 过滤未中奖用户
  const candidates = store.users.filter(u => u.status === 'normal')
  if (candidates.length === 0) {
    alert('所有人都已中奖！')
    return
  }
  
  if (isAllFinished.value) {
    alert('所有奖项已抽完！')
    return
  }
  
  isRolling.value = true
  
  // 动画循环
  timer = setInterval(() => {
    // 随机选取 drawCount 个用户展示
    const temp = []
    const count = Math.min(drawCount.value, candidates.length)
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * candidates.length)
      temp.push(candidates[idx])
    }
    displayUsers.value = temp
  }, 50) // 50ms 刷新一次
}

const stopRolling = () => {
  if (!isRolling.value) return
  clearInterval(timer)
  isRolling.value = false
  
  // 执行混合抽奖
  const winners = store.drawMixed(drawCount.value)
  if (winners.length > 0) {
    currentWinners.value = winners
    displayUsers.value = winners
    // showWinnerModal.value = true // 移除弹窗
    fireConfetti()
  } else {
    alert('抽奖失败，可能人数或奖品不足')
  }
}

// 监听弹窗关闭 (已移除)
// watch(showWinnerModal, (val) => {
// })

const toggleLottery = () => {
  if (isRolling.value) {
    stopRolling()
  } else {
    startRolling()
  }
}

// --- 键盘事件 ---
const handleKeyup = (e) => {
  if (e.code === 'Space') {
    // 防止空格键触发按钮点击
    e.preventDefault()
    toggleLottery()
  }
}

onMounted(() => {
  window.addEventListener('keyup', handleKeyup)
})


onUnmounted(() => {
  window.removeEventListener('keyup', handleKeyup)
  if (timer) clearInterval(timer)
})

// --- 特效 ---
const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
</script>

<template>
  <div class="lottery-page" :style="{ backgroundImage: store.settings.bgImage ? `url(${store.settings.bgImage})` : undefined }">
    <!-- 顶部 -->
    <header class="header">
      <h1 class="title">{{ store.settings.title }}</h1>
      <div class="controls">
        <router-link to="/admin">
          <a-button type="text" style="color: rgba(255,255,255,0.8)">
            <template #icon><icon-settings /></template>
            设置
          </a-button>
        </router-link>
      </div>
    </header>

    <div class="main-layout">
      <!-- 左侧：奖项列表 -->
      <aside class="left-panel">
        <div class="panel-title">奖项池</div>
        <div class="prize-list">
          <div 
            v-for="prize in store.prizes" 
            :key="prize.id" 
            class="prize-item" 
            :class="{ 
              finished: prize.drawn >= prize.count
            }"
          >
            <div class="prize-item-name">{{ prize.name }}</div>
            <div class="prize-item-count">
              剩 {{ prize.count - prize.drawn }} / 总 {{ prize.count }}
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${(prize.drawn / prize.count) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 中间：抽奖区域 -->
      <main class="center-panel">
        <div class="prize-info" v-if="!isAllFinished">
          <div class="mixed-info">
            <icon-trophy size="48" style="color: gold; margin-bottom: 10px;" />
            <h2 class="prize-name">
              年会大抽奖
            </h2>
            <div class="pool-stat">
              奖池剩余: <span class="num">{{ remainPrizes }}</span> / <span class="total">{{ totalPrizes }}</span>
            </div>
          </div>
          
          <div class="action-bar">
            <span class="label">每次抽取:</span>
            <a-input-number v-model="drawCount" :min="1" :max="50" style="width: 80px; background: rgba(255,255,255,0.9);" :disabled="isRolling" />
            <a-button 
              type="primary" 
              size="large" 
              shape="round" 
              :status="isRolling ? 'danger' : 'normal'"
              class="start-btn"
              @click="toggleLottery"
            >
              {{ isRolling ? '停止 (Space)' : '开始 (Space)' }}
            </a-button>
          </div>
        </div>
        
        <!-- 所有奖项抽完的提示 -->
        <div class="prize-info" v-else>
          <div class="all-finished">
            <icon-trophy size="64" style="color: gold; margin-bottom: 20px;" />
            <h2>所有奖项已抽取完毕</h2>
            <p>感谢大家的参与！</p>
          </div>
        </div>

        <div class="rolling-board" v-if="!isAllFinished">
          <div class="user-card" v-for="(user, index) in displayUsers" :key="index">
            <div class="avatar">{{ user.name[0] }}</div>
            <div class="info">
              <div class="name">{{ user.name }}</div>
              <div class="dept">{{ user.department }}</div>
            </div>
            <!-- 结果展示时显示奖项 -->
            <div class="won-prize" v-if="user.prizeId && !isRolling">
               {{ store.prizes.find(p => p.id === user.prizeId)?.name }}
            </div>
          </div>
          <div v-if="displayUsers.length === 0" class="placeholder">
            准备开始
          </div>
        </div>
      </main>

      <!-- 右侧：中奖名单 -->
      <aside class="right-panel">
        <div class="panel-title">中奖名单</div>
        <div class="winners-list">
          <div v-for="winner in winnersList" :key="winner.id" class="winner-row">
            <div class="winner-row-info">
              <span class="winner-row-name">{{ winner.name }}</span>
              <span class="winner-row-dept">{{ winner.department }}</span>
            </div>
            <div class="winner-row-prize">
              <a-tag :color="winner.prizeColor || 'gold'" size="small">{{ winner.prizeName }}</a-tag>
            </div>
          </div>
          <div v-if="winnersList.length === 0" class="empty-tip">
            暂无中奖记录
          </div>
        </div>
        <!-- 查看全部按钮 -->
        <div class="view-all-btn" v-if="winnersList.length > 0">
          <a-button class="check-all-btn" type="primary" size="small" long @click="openWinnersModal">查看全部名单</a-button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-all-btn {
  padding: 10px;
  background: rgba(0,0,0,0.1);
  border-top: 1px solid rgba(255,255,255,0.1);
  
  .check-all-btn {
    background-color: rgba(255, 215, 0, 0.2);
    border: 1px solid rgba(255, 215, 0, 0.6);
    color: #ffd700;
    
    &:hover {
      background-color: rgba(255, 215, 0, 0.3);
      border-color: #ffd700;
    }
  }
}
.lottery-page {
  width: 100vw;
  height: 100vh;
  background-color: #d71c1c;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  color: #fff;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
    pointer-events: none;
  }
}

.header {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
  background: rgba(0,0,0,0.1);
  backdrop-filter: blur(5px);
  
  .title {
    font-size: 24px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    margin: 0;
  }
  
  .controls {
    position: absolute;
    right: 20px;
  }
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  z-index: 2;
  padding: 20px;
  gap: 20px;
}

/* 侧边栏通用样式 */
.left-panel, .right-panel {
  width: 260px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);

  .panel-title {
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    background: rgba(0,0,0,0.2);
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
}

/* 左侧奖项列表 */
.prize-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  
  .prize-item {
    background: rgba(255,255,255,0.1);
    margin-bottom: 10px;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;
    
    &:hover {
      background: rgba(255,255,255,0.2);
    }
    
    &.active {
      background: rgba(255,215,0,0.2); // 金色高亮
      border-color: rgba(255,215,0,0.6);
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .prize-item-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .prize-item-count {
      font-size: 12px;
      opacity: 0.8;
      display: flex;
      justify-content: space-between;
    }
    
    .progress-bar {
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 2px;
      margin-top: 6px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: #00b42a; // Arco success color
      }
    }
  }
}

/* 中间抽奖区 */
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;
  
  .prize-info {
    text-align: center;
    margin-bottom: 30px;
    width: 100%;
    
    .prize-img {
      height: 120px;
      margin-bottom: 10px;
      img {
        height: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
    }
    
    .prize-name {
      font-size: 48px; // 更大的字体
      font-weight: bold;
      margin: 0 0 20px 0;
      text-shadow: 0 4px 8px rgba(0,0,0,0.5);
      letter-spacing: 2px;
    }
    
    .action-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      background: rgba(0,0,0,0.2);
      padding: 10px 20px;
      border-radius: 40px;
      width: fit-content;
      margin: 0 auto;
      
      .label {
        font-size: 16px;
      }
      
      .start-btn {
        width: 160px;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .all-finished {
      text-align: center;
      color: #fff;
      padding: 40px;
      
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        opacity: 0.8;
      }
    }
  }

  .rolling-board {
    flex: 1;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    gap: 20px;
    overflow-y: auto;
    
    .placeholder {
      font-size: 24px;
      opacity: 0.5;
      align-self: center;
      margin-top: 100px;
    }
  }
}

/* 卡片样式优化 */
.user-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 15px;
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  
  .avatar {
    width: 64px;
    height: 64px;
    background: #165dff;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .info {
    text-align: center;
    width: 100%;
    .name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dept {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

/* 右侧中奖名单 */
.winners-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  
  .winner-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255,255,255,0.9);
    margin-bottom: 8px;
    padding: 10px;
    border-radius: 6px;
    color: #333;
    animation: slideIn 0.3s ease-out;
    
    .winner-row-info {
      display: flex;
      flex-direction: column;
    }
    
    .winner-row-name {
      font-weight: bold;
      font-size: 14px;
    }
    
    .winner-row-dept {
      font-size: 12px;
      color: #666;
    }
  }
  
  .empty-tip {
    text-align: center;
    padding: 20px;
    opacity: 0.6;
  }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Modal styles (unused) */
.winner-grid {
  display: none;
}
.winner-item {
  display: none;
}
</style>
