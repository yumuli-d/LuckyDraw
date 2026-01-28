<script setup>
    import UserManagement from "./components/UserManagement.vue";
    import PrizeManagement from "./components/PrizeManagement.vue";
    import GlobalSettings from "./components/GlobalSettings.vue";
    import UsageInstructions from "./components/UsageInstructions.vue";
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
                <a-tabs default-active-key="1" lazy-load class="admin-tabs">
                    <a-tab-pane key="1" title="人员管理">
                        <div class="scroll-container">
                            <UserManagement />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" title="奖项管理">
                        <div class="scroll-container">
                            <PrizeManagement />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="4" title="全局设置">
                        <div class="scroll-container">
                            <GlobalSettings />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="5" title="使用说明">
                        <div class="scroll-container">
                            <UsageInstructions />
                        </div>
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
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
        height: calc(100vh - 100px);
        display: flex;
        flex-direction: column;
    }

    /* 关键：确保 Arco Card 的 body 也是 flex 布局并占满高度 */
    :deep(.arco-card-body) {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 16px 16px 16px; /* 去除顶部内边距，让 Tab 贴顶 */
    }

    :deep(.admin-tabs) {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .arco-tabs-content {
            flex: 1;
            overflow: hidden;
            padding: 0; /* 彻底去除标签页内容区域的所有默认内边距 */
        }

        .arco-tabs-content-list,
        .arco-tabs-pane {
            height: 100%;
        }
    }

    .scroll-container {
        height: 100%;
        overflow-y: auto;
        padding: 10px 20px 0 0; /* 统一设置 10px 的顶部留白 */
    }
</style>
