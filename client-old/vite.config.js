import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import postcssCustomMedia from 'postcss-custom-media'

export default defineConfig(({ mode }) => {
    const isProd = mode === "production";

    const outputOptions = isProd
        ? {
            entryFileNames: "assets/[name].[hash].js",
            chunkFileNames: "assets/[name].[hash].js",
            assetFileNames: "assets/[name].[hash].[ext]",
        }
        : {
            entryFileNames: "assets/[name].js",
            chunkFileNames: "assets/[name].js",
            assetFileNames: "assets/[name].[ext]",
        };

    return {
        plugins: [
            react(),
            viteStaticCopy({
                targets: [
                    { src: "src/audio", dest: "audio" }
                ]
            }),
        ],

        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
                "@public": resolve(__dirname, "public")
            },
        },

        build: {
            sourcemap: !isProd,
            target: "esnext",
            rollupOptions: {
                input: resolve(__dirname, 'public/index.html'),
                output: outputOptions,
            },
        },

        server: {
            open: "/",
            fs: {
                strict: false
            }
        },

        define: {
            PRODUCTION_BUILD: JSON.stringify(isProd)
        },

        experimental: {
            wasm: true,
        },
    };
});