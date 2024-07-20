<template>
  <div class="text-sm text-white">
    <label for="c4-model-select" class="text-xs text-shark-400 mb-1 block"> C4 model abstraction </label>
    <div
      class="relative text-sm rounded px-2.5 pt-1.5 w-full h-8 ring-1 ring-inset ring-shark-700 bg-gray-50"
    >
      <div class="relative cursor-pointer text-shark-400">
        <div class="flex gap-2 items-center" @click="toggleDropdown">
          <font-awesome-icon :icon="['fas', 'diagram-project']" :class="{ 'text-lightred': errorMessage }" />
          <span :class="selectedModel.length > 0 ? 'text-white' : 'text-lightred'">
            {{ formattedSelectedModel }}
          </span>
        </div>
        <div class="absolute top-0 right-1 mt-1 flex items-center gap-3 text-xs">
          <font-awesome-icon
            :icon="copied ? 'check' : 'copy'"
            :class="{
              'cursor-pointer hover:text-shark-300 text-shark-400': !copied,
              'text-spray-400': copied
            }"
            @click="handleCopy"
          />
          <font-awesome-icon
            :icon="['fas', 'caret-down']"
            :class="{ 'rotate-180': showDropdown }"
            @click="toggleDropdown"
          />
        </div>
      </div>
      <div
        v-show="showDropdown"
        class="absolute top-9 left-0 ring-1 ring-inset ring-shark-700 rounded bg-neutral-700 w-full z-10 max-h-40 overflow-auto"
      >
        <div
          v-for="model in c4ModelList"
          :key="model"
          class="flex items-center gap-2 p-2 hover:bg-shark-500 cursor-pointer"
          @click.stop="selectModel(model)"
        >
          <input
            :id="`checkbox-${model}`"
            type="checkbox"
            :checked="selectedModel.includes(model)"
            :value="model"
            class="ml-2 cursor-pointer"
            @click.stop="selectModel(model)"
          />
          <label :for="`checkbox-${model}`" class="cursor-pointer">
            {{ model }}
          </label>
        </div>
      </div>
    </div>
    <p v-show="errorMessage" class="text-lightred">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import { copyToClipboard } from '~/utils/helpers/handleCopy'

export default {
  props: ['modelValue', 'errorMessage'],
  data() {
    return {
      copied: false,
      showDropdown: false,
      selectedModel: [],
      c4ModelList: ['Software System', 'App', 'Store', 'Component', 'Connection']
    }
  },
  computed: {
    formattedSelectedModel() {
      return this.selectedModel.length > 0 ? this.selectedModel.join(', ') : 'Select an abstraction'
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.selectedModel = newValue
        }
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    handleCopy() {
      copyToClipboard(this.selectedModel.join(', '), this)
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    selectModel(model) {
      if (this.selectedModel.includes(model)) {
        this.selectedModel = this.selectedModel.filter((m) => m !== model)
      } else {
        this.selectedModel.push(model)
      }
      this.$emit('update:modelValue', this.selectedModel)
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    }
  }
}
</script>
