import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ArcoResolver()],
            imports: ["vue", "vue-router", "pinia"],
            eslintrc: {
                enabled: true // Generate .eslintrc-auto-import.json
            }
        }),
        Components({
            resolvers: [
                ArcoResolver({
                    sideEffect: true
                })
            ]
        })
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler"
            }
        }
    },
    base: "/LuckyDraw/",
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        // 1. Arco Design 相关依赖统一打包，避免循环引用
                        if (id.includes("@arco-design")) {
                            return "arco-vendor";
                        }

                        // 2. 优化其他第三方库分包
                        // Vue 全家桶
                        if (id.includes("vue") || id.includes("pinia") || id.includes("vue-router")) {
                            return "vue-vendor";
                        }
                        // 大型独立库单独打包
                        if (id.includes("xlsx")) {
                            return "xlsx-vendor";
                        }
                        if (id.includes("canvas-confetti")) {
                            return "confetti-vendor";
                        }
                        // 其他依赖
                        return "vendor";
                    }
                }
            }
        }
    }
});
