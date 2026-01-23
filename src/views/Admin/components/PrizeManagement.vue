<script setup>
import { ref, h, defineAsyncComponent } from 'vue'
import { useMainStore } from '@/store/mainStore'
import { Message, Modal } from '@arco-design/web-vue'

const PrizeModal = defineAsyncComponent(() => import('./PrizeModal.vue'))

const store = useMainStore()

const columns = [
  { title: '奖项名称', dataIndex: 'name' },
  { title: '颜色', slotName: 'color', width: 80 },
  { title: '奖品总数', dataIndex: 'count' },
  { title: '单次抽取数', dataIndex: 'perDraw' },
  { title: '已抽出', dataIndex: 'drawn' },
  { title: '操作', slotName: 'action' }
]

const openAdd = () => {
  const formRef = ref(null)
  Modal.open({
    title: '新增奖项',
    content: () => h(PrizeModal, {
      ref: formRef,
      isEdit: false
    }),
    onBeforeOk: async () => {
      const data = await formRef.value?.validate()
      if (!data) return false
      store.addPrize(data)
      Message.success('添加成功')
      return true
    }
  })
}

const openEdit = (prize) => {
  const formRef = ref(null)
  Modal.open({
    title: '编辑奖项',
    content: () => h(PrizeModal, {
      ref: formRef,
      prize,
      isEdit: true
    }),
    onBeforeOk: async () => {
      const data = await formRef.value?.validate()
      if (!data) return false
      store.updatePrize(data.id, data)
      Message.success('更新成功')
      return true
    }
  })
}

const handleDelete = (id) => {
  store.deletePrize(id)
  Message.success('删除成功')
}
</script>

<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button type="primary" @click="openAdd">新增奖项</a-button>
    </div>

    <a-table :data="store.prizes" :columns="columns" :pagination="false">
      <template #color="{ record }">
        <div :style="{ width: '24px', height: '24px', backgroundColor: record.color, borderRadius: '4px' }"></div>
      </template>
      <template #action="{ record }">
        <a-button type="text" size="small" @click="openEdit(record)">编辑</a-button>
        <a-popconfirm content="确定删除该奖项吗？" @ok="handleDelete(record.id)">
          <a-button type="text" status="danger" size="small">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
