<template>
  <div class="relative min-h-screen bg-transparent">
    <div class="absolute h-full w-full">
      <nav class="flex w-full items-center gap-4 bg-slate-800 py-2 px-4 text-slate-100">
        <Icon name="emojione:bar-chart" class="h-5 w-5" />
        <NuxtLink to="/" class="font-bold">OLAP App Title</NuxtLink>

        <button class="ml-auto rounded bg-slate-700 p-2 text-xs">
          <NuxtLink to="/demo">SQL Query Area</NuxtLink>
        </button>
      </nav>
      <slot />
    </div>
  </div>
</template>
