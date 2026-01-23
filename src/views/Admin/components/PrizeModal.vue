<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  prize: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const form = reactive({
  id: '',
  name: '',
  count: 1,
  perDraw: 1,
  color: '#165dff',
  ...props.prize
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
    <a-form-item field="name" label="奖项名称" :rules="[{ required: true, message: '请输入奖项名称' }]">
      <a-input v-model="form.name" />
    </a-form-item>
    <a-form-item field="color" label="标签颜色">
      <a-color-picker v-model="form.color" show-preset />
    </a-form-item>
    <a-form-item field="count" label="奖品总数" :rules="[{ required: true, message: '请输入奖品总数' }]">
      <a-input-number v-model="form.count" :min="1" />
    </a-form-item>
    <a-form-item field="perDraw" label="单次抽取数" :rules="[{ required: true, message: '请输入单次抽取数' }]">
      <a-input-number v-model="form.perDraw" :min="1" />
    </a-form-item>
  </a-form>
</template>
