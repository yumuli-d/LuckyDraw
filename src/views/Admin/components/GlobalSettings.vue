<script setup>
    import { reactive, watch, ref } from "vue";
    import { useMainStore } from "@/store/mainStore";
    import { Message } from "@arco-design/web-vue";
    import { IconUpload } from "@arco-design/web-vue/es/icon";

    const store = useMainStore();
    const form = reactive({
        title: store.settings.title,
        bgImage: store.settings.bgImage,
        drawMode: store.settings.drawMode || "selective"
    });

    // 双向绑定：store 变化更新 form，form 变化更新 store
    watch(
        () => store.settings,
        (newVal) => {
            if (newVal.title !== form.title) form.title = newVal.title;
            if (newVal.bgImage !== form.bgImage) form.bgImage = newVal.bgImage;
            if (newVal.drawMode !== form.drawMode) form.drawMode = newVal.drawMode;
        },
        { deep: true }
    );

    watch(
        form,
        (newVal) => {
            store.settings.title = newVal.title;
            store.settings.bgImage = newVal.bgImage;
            store.settings.drawMode = newVal.drawMode;
        },
        { deep: true }
    );

    const resetAll = () => {
        store.resetAll();
        Message.success("所有数据已重置");
    };

    const generateTestData = () => {
        store.generateTestData();
        Message.success("已生成测试数据：100人 + 5组奖项");
    };

    // 图片上传处理
    const fileInput = ref(null);
    const triggerUpload = () => {
        fileInput.value.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // 检查文件大小 (限制 2MB，防止 LocalStorage 溢出)
        if (file.size > 2 * 1024 * 1024) {
            Message.warning("图片大小建议不超过 2MB，否则可能导致存储失败");
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            form.bgImage = e.target.result;
            Message.success("图片上传成功");
        };
        reader.readAsDataURL(file);

        // 重置 input 防止重复选择同一文件不触发 change
        event.target.value = "";
    };
</script>

<template>
    <div style="max-width: 600px">
        <a-form :model="form" layout="vertical">
            <a-form-item field="title" label="活动标题">
                <a-input v-model="form.title" />
            </a-form-item>
            <a-form-item field="drawMode" label="抽奖模式">
                <a-radio-group v-model="form.drawMode" type="button">
                    <a-radio value="selective">常规模式 (先选奖项)</a-radio>
                    <a-radio value="mixed">混合模式 (全奖池随机)</a-radio>
                </a-radio-group>
                <template #extra>
                    <div>常规模式：手动选择一个奖项后进行抽取。</div>
                    <div>混合模式：从所有剩余奖项中随机分配（适合阳光普照奖等）。</div>
                </template>
            </a-form-item>
            <a-form-item field="bgImage" label="背景图片">
                <div class="upload-area">
                    <a-input
                        v-model="form.bgImage"
                        placeholder="支持输入URL或上传本地图片"
                        style="flex: 1; margin-right: 10px" />
                    <a-button type="outline" @click="triggerUpload">
                        <template #icon><icon-upload /></template>
                        上传图片
                    </a-button>
                    <input
                        type="file"
                        ref="fileInput"
                        style="display: none"
                        accept="image/*"
                        @change="handleFileChange" />
                </div>
                <div v-if="form.bgImage" class="preview-image" style="margin-top: 10px">
                    <a-image width="200" :src="form.bgImage" alt="背景预览" />
                </div>
            </a-form-item>
            <a-form-item label="数据操作">
                <a-space wrap>
                    <a-popconfirm
                        content="警告：这将清空所有人员、奖项设置和抽奖记录！此操作不可恢复！"
                        @ok="resetAll">
                        <a-button status="danger">重置整个系统</a-button>
                    </a-popconfirm>

                    <a-popconfirm
                        content="这将覆盖当前所有数据，生成100名测试人员和5组奖项。确定继续吗？"
                        @ok="generateTestData">
                        <a-button status="warning">一键生成测试数据</a-button>
                    </a-popconfirm>
                </a-space>
            </a-form-item>
        </a-form>
    </div>
</template>
