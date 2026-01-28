<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  speed: {
    type: Number,
    default: 1
  },
  radius: {
    type: Number,
    default: 300
  },
  highlight: {
    type: Boolean,
    default: false
  }
})

const container = ref(null)
const tags = ref([])
let animationFrameId = null

// 配置
// const RADIUS = 300
const BASE_SPEED = 0.002

// 初始化标签位置 (Fibonacci Sphere Algorithm)
const initTags = () => {
  const len = props.users.length
  if (len === 0) {
    tags.value = []
    return
  }

  const newTags = []
  const phi = Math.PI * (3 - Math.sqrt(5)) // 黄金角

  for (let i = 0; i < len; i++) {
    const y = 1 - (i / (len - 1)) * 2 // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y) // radius at y
    
    const theta = phi * i // golden angle increment

    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY

    newTags.push({
      user: props.users[i],
      x: x * props.radius,
      y: y * props.radius,
      z: z * props.radius,
      scale: 1,
      opacity: 1
    })
  }
  tags.value = newTags
}

watch(() => [props.users, props.radius], () => {
  initTags()
}, { immediate: true })

// 动画循环
const animate = () => {
  const speed = BASE_SPEED * props.speed
  
  // 旋转矩阵系数
  // 同时也引入一些随机性或鼠标交互（这里简化为自动旋转）
  // 绕Y轴旋转 + 轻微X轴倾斜
  const angleY = speed
  const angleX = speed * 0.2
  
  const cosY = Math.cos(angleY)
  const sinY = Math.sin(angleY)
  const cosX = Math.cos(angleX)
  const sinX = Math.sin(angleX)

  tags.value.forEach(tag => {
    // 绕Y轴
    let x = tag.x * cosY - tag.z * sinY
    let z = tag.z * cosY + tag.x * sinY
    
    // 绕X轴
    let y = tag.y * cosX - z * sinX
    z = z * cosX + tag.y * sinX
    
    tag.x = x
    tag.y = y
    tag.z = z
    
    // 计算缩放和透明度
    const scale = (2 * props.radius + z) / (2 * props.radius) // 简单的透视投影
    tag.scale = scale
    tag.opacity = Math.max(0.1, scale)
  })

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div class="tag-cloud-container" ref="container">
    <div 
      v-for="tag in tags" 
      :key="tag.user.id" 
      class="tag"
      :style="{
        transform: `translate3d(${tag.x}px, ${tag.y}px, 0) scale(${tag.scale})`,
        opacity: tag.opacity,
        zIndex: Math.floor(tag.scale * 100),
        color: highlight ? '#ffd700' : (tag.user.department === '研发部' ? '#165dff' : '#fff') // 简单的颜色区分
      }"
    >
      <div class="tag-content">
        <span class="tag-name">{{ tag.user.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  overflow: hidden;
}

.tag {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  pointer-events: none; /* 避免鼠标事件干扰 */
  text-shadow: 0 0 5px rgba(0,0,0,0.8);
  font-weight: bold;
  white-space: nowrap;
}

.tag-content {
  transform: translate(-50%, -50%); /* Center the text on the point */
  padding: 4px 8px;
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

.tag-name {
  font-size: 14px;
}
</style>
