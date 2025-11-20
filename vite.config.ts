import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      // Останавливаем dev-сервер при ошибках TypeScript
      overlay: {
        initialIsOpen: false,
        position: 'tl',
        badgeStyle: 'display: none;'
      },
      // Завершаем процесс при критических ошибках
      enableBuild: false,
      // Логирование ошибок в терминал
      terminal: true,
      // Строгий режим - процесс завершается с кодом ошибки
      eslint: false // Отключаем ESLint, только TypeScript
    })
  ],
  
  server: {
    hmr: {
      overlay: true // Показывать ошибки TypeScript в браузере
    }
  },
  
  esbuild: {
    // Строгая обработка ошибок
    logLevel: 'error'
  }
})