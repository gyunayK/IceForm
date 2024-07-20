<template>
  <div>
    <div class="flex justify-between mb-1">
      <h1 class="text-shark-400">Upload icon</h1>
      <span
        v-if="!lightIcon || !darkIcon"
        class="group text-shark-400 flex items-center font-medium justify-center gap-2 px-2 py-1 cursor-pointer hover:bg-shark-800 rounded-md absolute right-0 -top-1"
        @click="$emit('handleStep')"
      >
        <font-awesome-icon class="text-sm group-hover:text-white" :icon="['fas', 'xmark']" />
        Cancel
      </span>
      <!-- Reset button shows only when any image is uploaded -->
      <div
        v-if="lightIcon || darkIcon"
        class="text-shark-400 space-x-1 cursor-pointer hover:text-shark-300"
        @click="resetFile"
      >
        <span>Reset</span>
        <font-awesome-icon :icon="['fas', 'rotate-left']" />
      </div>
    </div>
    <div
      class="relative block w-full rounded border border-dashed border-shark-700 bg-gray-50 py-6 text-center focus:outline-none"
      :class="{
        'border-[#1BCBF5]': isDragOver,
        'border-shark-500': !isDragOver,
        'border-rose-500': fileTooLarge
      }"
      @dragover.prevent="dragOver"
      @dragenter.prevent="dragEnter"
      @dragleave.prevent="dragLeave"
      @drop.prevent="onFileDrop"
    >
      <!-- Original input for uploading the image; it's hidden and can be triggered by the buttons below -->
      <input ref="fileInput" type="file" accept=".svg, .png, .jpeg" class="hidden" @change="onFileChange" />
      <div v-if="!lightIcon && !darkIcon" class="text-shark-400 text-sm w-fit space-y-2 mx-auto">
        <p>Drag and drop image here</p>
        <p>Format: SVG / PNG / JPEG</p>
        <button
          type="button"
          class="bg-transparent ring-inset ring-1 ring-shark-700 hover:bg-shark-800 p-2 mt-2 w-full rounded-md text-white font-medium"
          @click="openFileDialog('fileInput')"
        >
          <font-awesome-icon :icon="['fas', 'upload']" class="text-base pr-1" />
          Upload image
        </button>
      </div>
      <!-- Image preview sections -->
      <div v-if="lightIcon || darkIcon" class="flex justify-center gap-4">
        <!-- Light mode preview; shows either the selected light image or the original upload -->
        <div>
          <h1 class="text-sm text-shark-400 mb-1">Light mode version</h1>
          <div class="w-48 h-20 bg-white flex items-center justify-center rounded">
            <img :src="lightIcon" class="h-14 w-full object-contain" alt="Light mode preview" />
          </div>
          <input
            ref="lightInput"
            type="file"
            class="hidden"
            accept=".svg, .png, .jpeg"
            @change="onLightIconChange"
          />
          <button
            type="button"
            class="bg-transparent ring-inset ring-1 ring-shark-700 hover:bg-shark-800 p-2 mt-2 w-full rounded-md text-white font-medium"
            @click="openFileDialog('lightInput')"
          >
            <font-awesome-icon :icon="['fas', 'upload']" class="text-base pr-1" />
            Upload image
          </button>
        </div>
        <!-- Dark mode preview; shows either the selected dark image or the original upload -->
        <div>
          <h1 class="text-sm text-shark-400 mb-1">Dark mode version</h1>
          <div class="w-48 h-20 bg-shark-950 flex items-center justify-center rounded">
            <img :src="darkIcon" class="h-14 w-full object-contain" alt="Dark mode preview" />
          </div>
          <input
            ref="darkInput"
            type="file"
            class="hidden"
            accept=".svg, .png, .jpeg"
            @change="onDarkIconChange"
          />
          <button
            type="button"
            class="bg-transparent ring-inset ring-1 ring-shark-700 hover:bg-shark-800 p-2 mt-2 w-full rounded-md text-white font-medium"
            @click="openFileDialog('darkInput')"
          >
            <font-awesome-icon :icon="['fas', 'upload']" class="text-base pr-1" />
            Upload image
          </button>
        </div>
        <!-- button send -->
      </div>
    </div>
    <p class="text-xs mt-1" :class="{ 'text-shark-400': !fileTooLarge, 'text-red': fileTooLarge }">
      {{ fileTooLarge ? 'Your file size is too big. Max file size: 5mb' : 'Max file size: 5mb' }}
    </p>
    <!-- Error message from parent component -->
    <p v-if="errorMessage" class="text-sm text-red">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
export default {
  props: ['errorMessage'],

  data() {
    return {
      isDragOver: false,
      fileTooLarge: false,
      lightIcon: null,
      darkIcon: null
    }
  },
  methods: {
    resetFile() {
      this.lightIcon = null
      this.darkIcon = null
      this.$refs.fileInput.value = ''
      this.$refs.lightInput.value = ''
      this.$refs.darkInput.value = ''
      this.fileTooLarge = false
    },
    dragOver() {
      this.isDragOver = true
    },
    dragEnter() {
      this.isDragOver = true
    },
    dragLeave() {
      this.isDragOver = false
    },
    onFileDrop(event) {
      const files = event.dataTransfer.files
      this.handleFiles(files)
      this.isDragOver = false
    },
    onFileChange(event) {
      const files = event.target.files
      this.handleFiles(files)
    },
    handleFiles(files) {
      if (files.length > 0) {
        const file = files[0]
        if (file.size <= 5000000) {
          this.lightIcon = URL.createObjectURL(file)
          this.darkIcon = URL.createObjectURL(file)
          this.fileTooLarge = false
          this.$emit('icon-uploaded', this.darkIcon, this.lightIcon)
        } else {
          this.fileTooLarge = true
        }
      }
    },
    openFileDialog(refName) {
      this.$refs[refName]?.click()
    },
    onLightIconChange(event) {
      const file = event.target.files[0]
      if (file && file.size <= 5000000) {
        this.lightIcon = URL.createObjectURL(file)
        this.$emit('light-icon-changed', this.lightIcon)
        this.fileTooLarge = false
      } else {
        this.fileTooLarge = true
      }
    },
    onDarkIconChange(event) {
      const file = event.target.files[0]
      if (file && file.size <= 5000000) {
        this.darkIcon = URL.createObjectURL(file)
        this.$emit('dark-icon-changed', this.darkIcon)
        this.fileTooLarge = false
      } else {
        this.fileTooLarge = true
      }
    }
  }
}
</script>
