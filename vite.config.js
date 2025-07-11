import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8800",
        changeOrigin: true,
      },
    },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],

//   server: {
//     port: 3000,
//     proxy: {
//       "/api": {
//         target: "https://server-by6klkyl4-olaspankys-projects.vercel.app", // Change this linessrfgs
//         changeOrigin: true,
//       },
//     },
//   },
// });
