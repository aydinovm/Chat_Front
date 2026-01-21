<template>
  <div class="w-80 bg-green-800 text-white flex flex-col h-screen">
    
    <!-- Шапка меню -->
    <div class="p-6 border-b border-green-700">
      <div class="flex items-center gap-3">
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
        <h1 class="text-xl font-bold">Система Чатов</h1>
      </div>
      <p class="text-sm text-green-200 mt-1">Панель администратора</p>
    </div>

    <!-- Пункты меню -->
    <nav class="flex-1 p-4 space-y-2">
      
      <NuxtLink
        to="/chats"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition',
          isActive('/chats') ? 'bg-green-700' : 'hover:bg-green-700/50'
        ]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="font-medium">Чаты</span>
      </NuxtLink>

      <NuxtLink
        to="/users"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition',
          isActive('/users') ? 'bg-green-700' : 'hover:bg-green-700/50'
        ]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="font-medium">Пользователи</span>
      </NuxtLink>

      <NuxtLink
        to="/departments"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition',
          isActive('/departments') ? 'bg-green-700' : 'hover:bg-green-700/50'
        ]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="font-medium">Департаменты</span>
      </NuxtLink>

      <NuxtLink
        to="/history"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition',
          isActive('/history') ? 'bg-green-700' : 'hover:bg-green-700/50'
        ]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">История</span>
      </NuxtLink>

      <NuxtLink
        to="/settings"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition',
          isActive('/settings') ? 'bg-green-700' : 'hover:bg-green-700/50'
        ]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="font-medium">Настройки</span>
      </NuxtLink>
    </nav>

    <!-- Кнопка выхода -->
    <div class="p-4 border-t border-green-700">
      <button class="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-green-700/50 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="font-medium">Выйти</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const isActive = (path) => {
  return route.path.startsWith(path)
}
</script>