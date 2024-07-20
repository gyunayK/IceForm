<template>
  <div ref="dropdownContainer">
    <label for="color-select" class="text-xs text-shark-400 mb-1 block"> Brand colour </label>
    <div
      class="relative text-sm rounded px-2.5 pt-1.5 w-full h-8 text-white ring-1 ring-inset ring-shark-700 bg-gray-50"
    >
      <div class="relative cursor-pointer text-shark-400">
        <div class="flex gap-2 items-center" @click="toggleDropdown">
          <font-awesome-icon :icon="['fas', 'palette']" :class="computedTextColor" />
          <span :class="computedTextColor">
            {{ selectedColor ? selectedColor.name : 'Select colour' }}
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
        class="absolute top-9 left-0 ring-1 ring-inset ring-shark-700 rounded-md bg-neutral-700 w-full z-10 max-h-40 overflow-auto"
      >
        <div
          v-for="color in colorList"
          :key="color.name"
          class="flex items-center gap-2 p-2 cursor-pointer hover:bg-shark-500"
          @click="selectColor(color)"
        >
          <font-awesome-icon :icon="['fas', 'square']" :class="color.class" />
          {{ color.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import colorList from '@/utils/colorConstraints.ts'
import { copyToClipboard } from '~/utils/helpers/handleCopy'

export default {
  props: ['modelValue'],
  data() {
    return {
      showDropdown: false,
      selectedColor: null,
      colorList,
      copied: false
    }
  },
  computed: {
    computedTextColor() {
      if (this.selectedColor && this.selectedColor.name) {
        return this.selectedColor.class
      }
      return 'text-shark-400'
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal) {
        const exists = this.colorList.find((color) => color.name === newVal)
        if (exists) {
          this.selectedColor = exists
        }
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleCopy() {
      copyToClipboard(this.selectedColor.name, this)
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    selectColor(color) {
      this.selectedColor = color
      this.toggleDropdown()
      this.$emit('update:modelValue', color.name)
    },
    handleClickOutside(event) {
      if (this.$refs.dropdownContainer && !this.$refs.dropdownContainer.contains(event.target)) {
        this.showDropdown = false
      }
    }
  }
}
</script>
