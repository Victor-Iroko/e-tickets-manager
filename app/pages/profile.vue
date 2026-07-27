<template>
  <div class="max-w-2xl mx-auto px-4 py-12 space-y-8">
    <h1 class="font-heading text-4xl font-bold">Profile & Account Settings</h1>

    <!-- Profile Details -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 class="font-bold text-lg">Personal Information</h2>
      <form class="space-y-4" @submit.prevent>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <UInput value="Jane Doe" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Email address</label>
          <UInput value="jane@example.com" type="email" class="w-full" />
        </div>
        <UButton type="submit" color="primary" class="bg-[#534AB7]">Save Profile</UButton>
      </form>
    </div>

    <!-- Password Change -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 class="font-bold text-lg">Change Password</h2>
      <form class="space-y-4" @submit.prevent>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
          <UInput type="password" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">New Password</label>
          <UInput type="password" class="w-full" />
        </div>
        <UButton type="submit" variant="outline">Update Password</UButton>
      </form>
    </div>
  </div>
</template>
