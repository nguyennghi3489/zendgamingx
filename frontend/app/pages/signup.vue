<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <Transition name="slide-up" appear delay="200">
        <div
          class="mt-8 bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200 transform transition-all duration-300 hover:shadow-2xl"
        >
          <div class="space-y-6">
            <form @submit.prevent="handleSignup" class="space-y-5">
              <div class="space-y-1">
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div class="relative">
                  <Icon
                    name="heroicons:user"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size="20"
                  />
                  <input
                    v-model="formState.username"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your full name"
                    :disabled="loading"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div class="relative">
                  <Icon
                    name="heroicons:envelope"
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size="20"
                  />
                  <input
                    v-model="formState.email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    :disabled="loading"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <Icon v-if="!loading" name="heroicons:user-plus" size="20" />
                  <Icon
                    v-if="loading"
                    name="heroicons:arrow-path"
                    size="20"
                    class="animate-spin"
                  />
                  {{ loading ? "Creating Account..." : "Create Account" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

const formState = reactive<SignupRequest>({
  username: "",
  email: "",
});

const loading = ref(false);
const { signup } = useAuth();

const handleSignup = async () => {
  const toast = useToast();

  try {
    loading.value = true;
    await signup(formState);

    toast.add({
      title: "Account Created Successfully!",
      description: "Welcome to ZendGaming! Redirecting to tournaments...",
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    await navigateTo("/tournaments");
  } catch (error: unknown) {
    toast.add({
      title: "Signup Failed",
      description: "An error occurred during signup. Please try again.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
