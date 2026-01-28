<script setup>
    import {
        IconBook,
        IconUserGroup,
        IconTrophy,
        IconSettings,
        IconApps
    } from "@arco-design/web-vue/es/icon";
</script>

<template>
    <div class="usage-instructions">
        <a-typography>
            <a-typography-title :heading="3"> <icon-book /> 系统使用说明 </a-typography-title>
            <a-typography-paragraph>
                欢迎使用年会抽奖系统。本系统为纯前端实现，所有数据均存储在您的浏览器本地。为了确保抽奖顺利进行，请按照以下步骤进行配置。
            </a-typography-paragraph>

            <a-divider />

            <a-typography-title :heading="4">
                <icon-user-group /> 第一步：导入人员名单
            </a-typography-title>
            <a-typography-paragraph>
                <ul>
                    <li>前往<strong>“人员管理”</strong>标签页。</li>
                    <li>准备一份 Excel 文件，包含<strong>姓名、工号、部门</strong>三列。</li>
                    <li>点击“Excel 导入”按钮上传文件。</li>
                    <li>您也可以点击“新增人员”手动添加个别漏掉的员工。</li>
                </ul>
            </a-typography-paragraph>

            <a-typography-title :heading="4"> <icon-trophy /> 第二步：配置奖项 </a-typography-title>
            <a-typography-paragraph>
                <ul>
                    <li>前往<strong>“奖项管理”</strong>标签页。</li>
                    <li>您可以修改默认的奖项，或者添加新的奖项。</li>
                    <li><strong>奖品总数</strong>：该奖项一共准备了多少份。</li>
                    <li>
                        <strong>单次抽取数</strong
                        >：在常规模式下，点击一次“开始”按钮会抽出的中奖人数。
                    </li>
                </ul>
            </a-typography-paragraph>

            <a-typography-title :heading="4">
                <icon-settings /> 第三步：全局设置
            </a-typography-title>
            <a-typography-paragraph>
                <ul>
                    <li>前往<strong>“全局设置”</strong>标签页。</li>
                    <li>设置活动标题（将显示在抽奖页顶部）。</li>
                    <li>上传背景图片（建议使用 1920x1080 尺寸的庆典风格图片）。</li>
                    <li>
                        <strong>选择抽奖模式</strong>：
                        <ul>
                            <li>
                                <strong>常规模式</strong
                                >：适合按顺序抽取特定奖项（如先抽三等奖，再抽二等奖）。
                            </li>
                            <li>
                                <strong>混合模式</strong
                                >：系统从所有剩余奖池中随机抽取奖项，适合阳光普照奖或多奖项混合抽取。
                            </li>
                        </ul>
                    </li>
                </ul>
            </a-typography-paragraph>

            <a-typography-title :heading="4"> <icon-apps /> 第四步：开始抽奖 </a-typography-title>
            <a-typography-paragraph>
                <ul>
                    <li>点击右上角的<strong>“返回抽奖页”</strong>。</li>
                    <li><strong>空格键 (Space)</strong>：控制抽奖的“开始”与“停止”。</li>
                    <li>
                        <strong>切换奖项</strong
                        >：在常规模式下，点击左侧奖项卡片即可切换当前抽取的目标。
                    </li>
                    <li>
                        <strong>查看结果</strong
                        >：抽奖完成后，中奖名单会自动出现在右侧。点击“查看全部名单”可全屏浏览并导出结果。
                    </li>
                </ul>
            </a-typography-paragraph>

            <a-alert type="warning" style="margin-top: 20px">
                温馨提示：本系统数据存储在浏览器中，<strong>请勿在抽奖过程中清理浏览器缓存或使用无痕模式</strong>，建议在正式抽奖前进行多次测试。
            </a-alert>
        </a-typography>
    </div>
</template>

<style scoped>
    .usage-instructions {
        padding: 0 0 20px 0; /* 这里的 padding 交给父容器 scroll-container 统一管理 */
        max-width: 800px;
    }

    /* 强制去除第一个标题的上边距 */
    .usage-instructions :deep(h1.arco-typography-title),
    .usage-instructions :deep(h2.arco-typography-title),
    .usage-instructions :deep(h3.arco-typography-title),
    .usage-instructions :deep(h4.arco-typography-title),
    .usage-instructions :deep(.arco-typography-title:first-child) {
        margin-top: 0 !important;
        padding-top: 0 !important;
    }

    /* 去除 typography 组件可能的默认边距 */
    .usage-instructions :deep(.arco-typography) {
        margin-top: 0;
    }

    ul {
        padding-left: 20px;
    }

    li {
        margin-bottom: 8px;
        line-height: 1.6;
    }

    strong {
        color: var(--color-primary-light-4);
    }
</style>
