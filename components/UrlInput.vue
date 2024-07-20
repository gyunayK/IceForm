<template>
  <div class="text-white">
    <div v-if="main">
      <label :for="id" class="text-xs text-shark-400 mb-3 block">
        {{ label }}
      </label>
      <div class="flex items-center pl-1">
        <font-awesome-icon :icon="icon" class="text-shark-400" />
        <span class="text-shark-100 text-sm underline gap-x-2 ml-2 w-fit cursor-pointer" @click="handleRoute">
          {{ inputValue }}
        </span>
        <div class="text-shark-400 ml-2 scale-75 flex items-center gap-4">
          <font-awesome-icon
            :icon="copied ? 'check' : 'copy'"
            :class="{
              'cursor-pointer text-shark-400 hover:text-shark-300': !copied,
              'text-spray-400': copied
            }"
            @click="handleCopy"
          />
          <font-awesome-icon
            icon="arrow-up-right-from-square"
            class="cursor-pointer hover:text-shark-300"
            @click="handleRoute"
          />
        </div>
      </div>
    </div>
    <div v-if="!main" class="relative">
      <label :for="id" class="text-xs text-shark-400 mb-1 block">
        {{ label }}
      </label>
      <font-awesome-icon
        :icon="icon"
        class="absolute left-0 ml-3 mt-2"
        :class="{
          'text-lightred': touched && errorMessage,
          'text-shark-400': !errorMessage
        }"
      />
      <svg
        v-if="touched && errorMessage"
        class="h-5 w-5 absolute right-0 mr-3 mt-1.5 text-lightred"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        :id="id"
        v-model="inputValue"
        :placeholder="placeholder"
        class="px-9 pt-1.5 w-full h-8 text-shark-50 text-sm rounded border-0 ring-1 ring-inset bg-gray-50 focus:ring-spray-300"
        :class="{
          'placeholder:text-lightred ring-lightred': errorMessage && touched,
          'placeholder:text-shark-400 ring-shark-700': !errorMessage,
        }"
        @blur="onBlur"
      />
      <div class="absolute top-6 right-2 mt-1 scale-75 flex items-center gap-4">
        <font-awesome-icon
          :icon="copied ? 'check' : 'copy'"
          :class="{
            'cursor-pointer text-shark-400 hover:text-shark-300': !copied,
            'text-spray-400': copied
          }"
          @click="handleCopy"
        />
        <font-awesome-icon
          v-if="inputValue && !errorMessage"
          icon="arrow-up-right-from-square"
          class="cursor-pointer text-shark-400 hover:text-shark-300"
          @click="handleRoute"
        />
      </div>
      <p v-if="errorMessage && touched" :class="{ 'text-sm text-lightred mt-1': errorMessage && touched }">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from '~/utils/helpers/handleCopy'

export default {
  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    icon: String,
    id: String,
    errorMessage: String,
    main: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showInput: false,
      inputValue: this.modelValue,
      touched: false,
      copied: false
    }
  },

  methods: {
    handleRoute() {
      window.open(this.inputValue, '_blank')
    },
    handleCopy() {
      copyToClipboard(this.inputValue, this)
    },
    onBlur() {
      this.touched = true
      this.$emit('update:modelValue', this.inputValue)
    }
  }
}
</script>
