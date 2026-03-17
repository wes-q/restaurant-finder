import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "node",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "server-only": path.resolve(__dirname, "test/mocks/server-only.ts"),
        },
    },
});

// import { defineConfig } from "vitest/config";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig({
//     test: {
//         environment: "node",
//     },
//     resolve: {
//         alias: {
//             "@": path.resolve(__dirname, "src"),
//             "server-only": path.resolve(__dirname, "test/mocks/server-only.ts"),
//         },
//     },
// });
