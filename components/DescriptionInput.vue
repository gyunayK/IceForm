<template>
  <div>
    <label for="description" class="text-xs text-shark-400 mb-1 block"> Description suggestion </label>
    <textarea
      id="description"
      :value="modelValue"
      placeholder="e.g. A C4 model diagramming and modelling tool for agile teams to align on technical decisions."
      class="resize-none block w-full rounded border-none py-2 px-3 overflow-hidden text-shark-50 ring-inset ring-1 ring-shark-700 placeholder:text-shark-400 bg-gray-50 text-sm focus:ring-spray-300"
      maxlength="120"
      @input="emitInput"
      @keydown="handleKeydown"
    />
    <div class="flex justify-end items-center gap-x-3 text-xs mt-1">
      <font-awesome-icon
        :icon="copied ? 'check' : 'copy'"
        :class="{
          'cursor-pointer hover:text-shark-300 text-shark-400': !copied,
          'text-spray-400': copied
        }"
        @click="handleCopy"
      />
      <span class="text-shark-400">
        <span :class="{ 'text-shark-50': charCount > 0 }">{{ charCount }}</span>
        / 120 characters
      </span>
    </div>
    <p v-if="errorMessage" class="text-sm text-red-500">
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
      copied: false
    }
  },
  computed: {
    charCount() {
      return this.modelValue.length
    }
  },
  methods: {
    handleCopy() {
      copyToClipboard(this.modelValue, this)
    },
    resizeTextarea(e) {
      const area = e.target
      area.style.height = '0px'
      area.style.height = area.scrollHeight + 'px'
    },
    emitInput(e) {
      this.$emit('update:modelValue', e.target.value)
      this.resizeTextarea(e)
    },
    handleKeydown(e) {
      if (e.key === 'Enter' && e.target.offsetHeight >= 160) {
        e.preventDefault()
      }
    }
  }
}
</script>
