<script setup>
import { reactive, ref } from 'vue'
import { useMainStore } from '@/store/mainStore'
import { Message } from '@arco-design/web-vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  // 函数式调用时，Modal 实例会自动注入 close 方法，但通过 h 函数传递 props 时无法直接访问 modal 实例
  // 我们需要父组件传递一个 callback 来关闭 modal，或者依赖 Modal.open 的 onOk
  // 更好的方式是：组件内部只负责表单，Modal 的按钮由 Modal.open 配置
  // 或者：组件包含整个 Modal 内容（不推荐，因为 Modal.open 会自动包裹 Modal 结构）
  // 最佳实践：组件只渲染 content，Modal 的 footer 由 Modal.open 配置，或者组件自己渲染 footer 并隐藏 Modal 默认 footer
})

// 为了在 Modal.open 中通过 ref 获取表单数据，我们需要暴露 form
const form = reactive({
  id: '',
  name: '',
  number: '',
  department: '',
  ...props.user
})

const formRef = ref(null)

const validate = async () => {
  const res = await formRef.value?.validate()
  if (res) return false
  return form
}

defineExpose({ validate })
</script>

<template>
  <a-form ref="formRef" :model="form" layout="vertical">
    <a-form-item field="name" label="姓名" :rules="[{ required: true, message: '请输入姓名' }]">
      <a-input v-model="form.name" />
    </a-form-item>
    <a-form-item field="number" label="工号" :rules="[{ required: true, message: '请输入工号' }]">
      <a-input v-model="form.number" />
    </a-form-item>
    <a-form-item field="department" label="部门">
      <a-input v-model="form.department" />
    </a-form-item>
  </a-form>
</template>
