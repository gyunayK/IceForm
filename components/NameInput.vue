<template>
  <div>
    <label for="technology-name" class="text-xs text-shark-400 mb-2 block"> Technology name </label>
    <div class="relative">
      <input
        id="technology-name"
        v-model="inputValue"
        type="text"
        placeholder="Your technology name"
        class="w-full h-8 text-shark-50 rounded border-0 pl-3 pr-10 pt-1.5 ring-inset ring-1 bg-gray-50 text-sm focus:ring-spray-300"
        :class="{
          'placeholder:text-lightred ring-lightred': errorMessage,
          'placeholder:text-shark-400 ring-shark-700': !errorMessage
        }"
        @blur="$emit('update:modelValue', inputValue)"
      />
      <font-awesome-icon
        :icon="copied ? 'check' : 'copy'"
        class="absolute top-2 right-3 scale-75"
        :class="{
          'cursor-pointer hover:text-shark-300': !copied,
          'text-spray-400': copied,
          'text-shark-400': !copied
        }"
        @click="handleCopy"
      />
      <font-awesome-icon
        v-if="inputError === 'User Not Exist'"
        :icon="['fas', 'circle-check']"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-green"
      />
      <font-awesome-icon
        v-if="inputError === 'User Exist'"
        :icon="['fas', 'xmark']"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-red"
      />
    </div>
    <p
      v-if="errorMessage"
      class="text-sm"
      :class="{
        'text-lightred': inputError === 'zod' || inputError === 'User Exist',
        'text-green': inputError === 'User Not Exist'
      }"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import { copyToClipboard } from '~/utils/helpers/handleCopy'

export default {
  props: ['modelValue', 'errorMessage', 'errorType'],
  emits: ['update:modelValue', 'update:errorMessage'],

  data() {
    return {
      inputError: 'zod',
      url: '',
      inputValue: this.modelValue,
      copied: false
    }
  },
  methods: {
    handleCopy() {
      copyToClipboard(this.inputValue, this)
    },
    async handleInputChange(value) {
      // TODO: [GYUNAY] Check if the technology name already exists
      // this.$emit('update:modelValue', value)
      // if (!value) {
      //   this.$emit('update:errorMessage', '')
      //   this.inputError = 'zod'
      //   return
      // }
      // try {
      //   const response = await axios.post('http://localhost:3000/api/form/technology/name', {
      //     url: value
      //   })
      //   if (response.data.exists) {
      //     this.$emit('update:errorMessage', 'This already exists!')
      //     this.inputError = 'User Exist'
      //   } else {
      //     this.$emit('update:errorMessage', 'Cool - this hasn’t been added yet!')
      //     this.inputError = 'User Not Exist'
      //   }
      // } catch (error) {
      //   console.error('Error checking technology name:', error)
      //   this.$emit('update:errorMessage', 'An error occurred while checking the technology name.')
      //   this.inputError = true
      // }
    }
  }
}
</script>
