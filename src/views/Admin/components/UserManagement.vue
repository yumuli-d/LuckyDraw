<script setup>
import { ref, computed, h, defineAsyncComponent } from 'vue'
import { useMainStore } from '@/store/mainStore'
import { Message, Modal } from '@arco-design/web-vue'
import * as XLSX from 'xlsx'

const UserModal = defineAsyncComponent(() => import('./UserModal.vue'))

const store = useMainStore()
const searchQuery = ref('')

const columns = [
  { title: '工号', dataIndex: 'number' },
  { title: '姓名', dataIndex: 'name' },
  { title: '部门', dataIndex: 'department' },
  { title: '状态', slotName: 'status' },
  { title: '操作', slotName: 'action' }
]

const filteredUsers = computed(() => {
  if (!searchQuery.value) return store.users
  const q = searchQuery.value.toLowerCase()
  return store.users.filter(u => 
    u.name.toLowerCase().includes(q) || 
    u.number.toLowerCase().includes(q) ||
    u.department.toLowerCase().includes(q)
  )
})

const openAdd = () => {
  const formRef = ref(null)
  Modal.open({
    title: '新增人员',
    content: () => h(UserModal, { 
      ref: formRef,
      isEdit: false 
    }),
    onBeforeOk: async () => {
      const data = await formRef.value?.validate()
      if (!data) return false
      store.addUser(data)
      Message.success('添加成功')
      return true
    }
  })
}

const openEdit = (user) => {
  const formRef = ref(null)
  Modal.open({
    title: '编辑人员',
    content: () => h(UserModal, { 
      ref: formRef,
      user,
      isEdit: true 
    }),
    onBeforeOk: async () => {
      const data = await formRef.value?.validate()
      if (!data) return false
      store.updateUser(data.id, data)
      Message.success('更新成功')
      return true
    }
  })
}

const handleDelete = (id) => {
  store.deleteUser(id)
  Message.success('删除成功')
}


// --- 导入 ---
const handleUpload = (option) => {
  const { fileItem } = option
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet)
      
      // 假设 Excel 列名为: 姓名, 工号, 部门
      let count = 0
      json.forEach(row => {
        if (row['姓名'] && row['工号']) {
          store.addUser({
            name: row['姓名'],
            number: String(row['工号']),
            department: row['部门'] || '其他'
          })
          count++
        }
      })
      Message.success(`成功导入 ${count} 条数据`)
    } catch (err) {
      console.error(err)
      Message.error('解析文件失败')
    }
  }
  reader.readAsBinaryString(fileItem.file)
}

const resetStatus = () => {
  store.resetUserStatus()
  Message.success('已重置所有人员抽奖状态')
}
</script>

<template>
  <div>
    <a-space style="margin-bottom: 16px; justify-content: space-between; width: 100%">
      <a-space>
        <a-upload :custom-request="handleUpload" :show-file-list="false" accept=".xlsx, .xls">
          <template #upload-button>
            <a-button type="outline">Excel 导入</a-button>
          </template>
        </a-upload>
        <a-button type="primary" @click="openAdd">新增人员</a-button>
        <a-popconfirm content="确定要重置所有人的中奖状态吗？这将允许他们再次参与抽奖。" @ok="resetStatus">
          <a-button status="warning">重置抽奖状态</a-button>
        </a-popconfirm>
      </a-space>
      <a-input-search v-model="searchQuery" placeholder="搜索姓名/工号" style="width: 200px" />
    </a-space>

    <a-table :data="filteredUsers" :columns="columns" :pagination="{ pageSize: 10 }">
      <template #status="{ record }">
        <a-tag :color="record.status === 'won' ? 'green' : 'gray'">
          {{ record.status === 'won' ? '已中奖' : '未中奖' }}
        </a-tag>
      </template>
      <template #action="{ record }">
        <a-button type="text" size="small" @click="openEdit(record)">编辑</a-button>
        <a-popconfirm content="确定删除该人员吗？" @ok="handleDelete(record.id)">
          <a-button type="text" status="danger" size="small">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
