import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    settings: {
      title: '2026年会抽奖活动',
      bgImage: ''
    },
    /**
     * 用户列表
     * @type {Array<{id: string, name: string, number: string, department: string, status: 'normal'|'won', prizeId: string|null}>}
     */
    users: [],
    /**
     * 奖项列表
     * @type {Array<{id: string, name: string, count: number, perDraw: number, drawn: number, color: string}>}
     */
    prizes: [
      { id: '1', name: '特等奖', count: 1, perDraw: 1, drawn: 0, color: '#f53f3f' },
      { id: '2', name: '一等奖', count: 3, perDraw: 1, drawn: 0, color: '#ff7d00' },
      { id: '3', name: '二等奖', count: 5, perDraw: 5, drawn: 0, color: '#f7ba1e' },
      { id: '4', name: '三等奖', count: 10, perDraw: 5, drawn: 0, color: '#99cc33' }
    ],
    /**
     * 中奖记录
     * @type {Array<{id: string, prizeId: string, userIds: string[], time: number}>}
     */
    winners: [],
    currentPrizeId: '4' // 默认选中最后一个奖项（通常是小奖先抽）
  }),
  actions: {
    // --- 用户管理 ---
    addUser(user) {
      this.users.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        status: 'normal',
        prizeId: null,
        ...user
      })
    },
    updateUser(id, data) {
      const index = this.users.findIndex(u => u.id === id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...data }
      }
    },
    deleteUser(id) {
      this.users = this.users.filter(u => u.id !== id)
    },
    resetUserStatus() {
      this.users.forEach(u => {
        u.status = 'normal'
        u.prizeId = null
      })
      this.prizes.forEach(p => p.drawn = 0)
      this.winners = []
    },
    
    // --- 奖项管理 ---
    addPrize(prize) {
      this.prizes.push({
        id: Date.now().toString(),
        drawn: 0,
        ...prize
      })
    },
    updatePrize(id, data) {
      const index = this.prizes.findIndex(p => p.id === id)
      if (index !== -1) {
        this.prizes[index] = { ...this.prizes[index], ...data }
      }
    },
    deletePrize(id) {
      this.prizes = this.prizes.filter(p => p.id !== id)
    },

    // --- 抽奖逻辑 ---
    
    /**
     * 混合抽奖逻辑
     * @param {number} count 抽取人数
     */
    drawMixed(count) {
      // 1. 准备奖品池：展平所有剩余奖项
      const prizePool = []
      this.prizes.forEach(p => {
        const remain = p.count - p.drawn
        for (let i = 0; i < remain; i++) {
          prizePool.push(p.id)
        }
      })

      if (prizePool.length === 0) return []

      // 2. 准备候选人
      const candidates = this.users.filter(u => u.status === 'normal')
      if (candidates.length === 0) return []

      // 3. 确定实际抽取数量
      const actualCount = Math.min(count, prizePool.length, candidates.length)
      if (actualCount === 0) return []

      // 4. 随机抽取奖品
      // 使用 Fisher-Yates 洗牌算法打乱奖品池
      for (let i = prizePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [prizePool[i], prizePool[j]] = [prizePool[j], prizePool[i]];
      }
      const selectedPrizeIds = prizePool.slice(0, actualCount)

      // 5. 随机抽取用户
      const winners = []
      const indices = new Set()
      while (winners.length < actualCount) {
        const idx = Math.floor(Math.random() * candidates.length)
        if (!indices.has(idx)) {
          indices.add(idx)
          const user = candidates[idx]
          // 分配奖品
          const prizeId = selectedPrizeIds[winners.length]
          
          user.status = 'won'
          user.prizeId = prizeId
          winners.push(user)
        }
      }

      // 6. 更新奖项统计和记录
      const time = Date.now()
      const batchId = time.toString() // 使用时间戳作为批次ID
      
      // 按奖项归类
      const winnersByPrize = {}
      winners.forEach(w => {
        if (!winnersByPrize[w.prizeId]) {
          winnersByPrize[w.prizeId] = []
        }
        winnersByPrize[w.prizeId].push(w.id)
      })

      Object.entries(winnersByPrize).forEach(([prizeId, userIds]) => {
        // 更新奖项计数
        const prize = this.prizes.find(p => p.id === prizeId)
        if (prize) {
          prize.drawn += userIds.length
        }

        // 添加记录
        this.winners.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          batchId, // 添加批次ID
          prizeId,
          userIds,
          time
        })
      })

      return winners
    },

    resetAll() {
      this.users = []
      this.winners = []
      this.prizes.forEach(p => p.drawn = 0)
      this.settings.bgImage = ''
      this.settings.title = '2026年会抽奖活动'
    },

    generateTestData() {
      // 1. 重置所有数据
      this.users = []
      this.winners = []
      
      // 2. 生成100名测试用户
      const departments = ['研发部', '产品部', '设计部', '市场部', '运营部', '人事部', '财务部']
      const newUsers = []
      for (let i = 1; i <= 100; i++) {
        const dept = departments[Math.floor(Math.random() * departments.length)]
        newUsers.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5) + i,
          name: `测试员工${i}`,
          number: `T${1000 + i}`,
          department: dept,
          status: 'normal',
          prizeId: null
        })
      }
      this.users = newUsers

      // 3. 生成标准奖项配置
      this.prizes = [
        { id: '1', name: '特等奖', count: 1, perDraw: 1, drawn: 0, color: '#f53f3f' },
        { id: '2', name: '一等奖', count: 3, perDraw: 1, drawn: 0, color: '#ff7d00' },
        { id: '3', name: '二等奖', count: 10, perDraw: 5, drawn: 0, color: '#f7ba1e' },
        { id: '4', name: '三等奖', count: 20, perDraw: 10, drawn: 0, color: '#99cc33' },
        { id: '5', name: '阳光普照奖', count: 50, perDraw: 10, drawn: 0, color: '#165dff' }
      ]
      
      // 默认选中最后一个奖项
      this.currentPrizeId = '5'
    }
  },
  persist: true
})
