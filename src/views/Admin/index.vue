<script setup>
import UserManagement from './components/UserManagement.vue'
import PrizeManagement from './components/PrizeManagement.vue'
import ResultManagement from './components/ResultManagement.vue'
import GlobalSettings from './components/GlobalSettings.vue'
</script>

<template>
  <a-layout class="admin-layout">
    <a-layout-header>
      <div class="header">
        <div class="logo">年会抽奖系统后台</div>
        <div class="actions">
          <router-link to="/">
            <a-button>返回抽奖页</a-button>
          </router-link>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="content">
      <a-card class="card-container">
        <a-tabs default-active-key="1" lazy-load>
          <a-tab-pane key="1" title="人员管理">
            <UserManagement />
          </a-tab-pane>
          <a-tab-pane key="2" title="奖项管理">
            <PrizeManagement />
          </a-tab-pane>
          <a-tab-pane key="3" title="抽奖记录">
            <ResultManagement />
          </a-tab-pane>
          <a-tab-pane key="4" title="全局设置">
            <GlobalSettings />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.admin-layout {
  height: 100vh;
  background-color: var(--color-fill-2);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 10;
  position: relative;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-text-1);
}

.content {
  padding: 20px;
  overflow: auto;
}

.card-container {
  min-height: calc(100vh - 100px);
}
</style>
