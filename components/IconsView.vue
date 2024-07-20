<template>
  <div class="relative text-shark-50 mt-2 text-xs">
    <div v-if="step === 1">
      <!-- MAIN WRAPPER -->
      <div class="flex justify-between text-shark-400 mb-3">
        <span class="text-nowrap">Dark mode</span>
        <span class="text-nowrap">Light mode</span>
      </div>
      <div class="grid grid-cols-10 min-h-16">
        <!-- Dark Carousel Container -->
        <div :class="[showLightCarousel ? 'col-span-1' : 'col-span-7', 'relative flex items-center']">
          <!-- Navigation Buttons for Dark Icons -->
          <button
            v-if="showDarkCarousel && shouldShowNavigationButtons"
            type="button"
            class="absolute -left-7 ml-2 top-1/2 transform -translate-y-1/2 text-shark-300 px-2 py-1 rounded-full disabled:text-shark-600"
            :disabled="isFirstDarkIcon"
            @click="prev('dark')"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <button
            v-if="showDarkCarousel && shouldShowNavigationButtons"
            type="button"
            :disabled="isLastDarkIcon"
            class="absolute -right-7 mr-2 top-1/2 transform -translate-y-1/2 text-shark-300 px-2 py-1 rounded-full disabled:text-shark-600"
            @click="next('dark')"
          >
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
          <div v-if="!showDarkCarousel" class="flex items-start w-full group relative">
            <div class="group relative">
              <div class="h-14 w-14 p-1 rounded-[10px] bg-shark-800 flex items-center justify-center">
                <img class="w-full h-full object-contain rounded-md" :src="darkIcon" alt="static icon" />
                <div
                  v-if="shouldShowCarousels"
                  class="group-hover:block absolute hidden inset-0 bg-gray-55 rounded-lg cursor-pointer"
                  @click="toggleCarousel('dark')"
                >
                  <font-awesome-icon
                    class="text-shark-50 text-base absolute right-0 top-0 -translate-x-5 translate-y-4"
                    :icon="['fas', 'pencil-alt']"
                  />
                </div>
                <div
                  v-if="!shouldShowCarousels"
                  class="group-hover:block hidden absolute inset-0 bg-gray-55 rounded-lg cursor-pointer"
                  @click="downloadIcon(darkIcon)"
                >
                  <font-awesome-icon
                    class="text-base text-shark-50 absolute right-0 top-0 -translate-x-5 translate-y-4"
                    :icon="['fas', 'download']"
                  />
                </div>
              </div>
              <div
                v-if="shouldShowCarousels"
                class="group-hover:block hidden absolute -left-9 -bottom-6 bg-shark-950"
              >
                <span class="text-nowrap text-sm rounded-sm p-1 bg-gray-55">
                  Edit dark mode icon
                </span>
              </div>
            </div>
          </div>
          <div v-if="shouldShowCarousels" class="carousel-container">
            <div :class="['expander', showLightCarousel ? 'collapsed-dark' : 'expanded-dark']">
              <div class="expander-content py-1 ml-1">
                <div
                  class="carousel transition-transform duration-500 ease-in-out w-full"
                  :style="{
                    transform: `translateX(-${(currentDarkIndex * 101) / allIcons.length}%)`
                  }"
                >
                  <div v-for="(icon, index) in allIcons" :key="index" class="relative group">
                    <div class="h-14 w-14 rounded-[10px] bg-gray-50 flex items-center justify-center p-1">
                      <!-- TODO: GYUNAY Tech-choices V2 -->
                      <!-- @click="handleActiveIcon(icon, 'dark')" -->
                      <!-- :class="{
                        'outline outline-2 outline-spray-300':
                          activeIconDark === icon,
                      }" -->
                      <img class="w-full h-full object-contain rounded-md" :src="icon" alt="brand icon" />
                    </div>
                    <div
                      class="group-hover:block hidden absolute inset-0 bg-gray-55 rounded-lg cursor-pointer"
                      @click="downloadIcon(icon)"
                    >
                      <font-awesome-icon
                        class="text-shark-50 text-base absolute right-0 top-0 -translate-x-5 translate-y-4"
                        :icon="['fas', 'download']"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Light Carousel Container -->
        <div
          :class="[
            showLightCarousel ? 'col-start-4 col-end-11' : 'col-start-10 -translate-x-5',
            'relative flex justify-end'
          ]"
        >
          <!-- Navigation Buttons for Light Icons -->
          <button
            v-if="showLightCarousel && shouldShowNavigationButtons"
            type="button"
            :disabled="isFirstLightIcon"
            class="absolute -left-4 top-1/2 transform -translate-y-1/2 text-shark-300 disabled:text-shark-600"
            @click="prev('light')"
          >
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <button
            v-if="showLightCarousel && shouldShowNavigationButtons"
            type="button"
            :disabled="isLastLightIcon"
            class="absolute -right-3 top-1/2 transform -translate-y-1/2 text-shark-300 disabled:text-shark-600"
            @click="next('light')"
          >
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
          <div v-if="shouldShowCarousels" class="carousel-container">
            <div :class="['expander', showLightCarousel ? 'expanded-light' : 'collapsed-light']">
              <div class="expander-content py-1 ml-1">
                <div
                  class="carousel transition-transform duration-500 ease-in-out w-full"
                  :style="{
                    transform: `translateX(-${(currentLightIndex * 101) / allIcons.length}%)`
                  }"
                >
                  <div v-for="(icon, index) in allIcons" :key="index" class="relative group">
                    <div
                      class="h-14 w-14 rounded-[10px] bg-white flex items-center justify-center cursor-pointer p-1"
                    >
                      <!-- TODO: GYUNAY Tech-choices V2 -->
                      <!-- @click="handleActiveIcon(icon, 'light')" -->
                      <!-- :class="{
                        'outline outline-2 outline-spray-300':
                          activeIconLight === icon,
                      }" -->
                      <img class="w-full h-full object-contain rounded-md" :src="icon" alt="brand icon" />
                    </div>
                    <div
                      class="group-hover:block hidden absolute inset-0 bg-gray-55 rounded-lg cursor-pointer"
                      @click="downloadIcon(icon)"
                    >
                      <font-awesome-icon
                        class="text-shark-50 text-base absolute right-0 top-0 -translate-x-5 translate-y-4"
                        :icon="['fas', 'download']"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!showLightCarousel" class="flex items-center w-full group relative">
            <div class="group relative">
              <div class="h-14 w-14 p-1 rounded-[10px] bg-white flex items-center justify-center">
                <img class="w-full h-full object-contain rounded-md" :src="lightIcon" alt="static icon" />
                <div
                  v-if="shouldShowCarousels"
                  class="group-hover:block hidden absolute inset-0 bg-gray-55 rounded-lg cursor-pointer"
                  @click="toggleCarousel('light')"
                >
                  <font-awesome-icon
                    class="text-base text-shark-50 absolute right-0 top-0 -translate-x-5 translate-y-4"
                    :icon="['fas', 'pencil-alt']"
                  />
                </div>
                <div
                  v-if="!shouldShowCarousels"
                  class="group-hover:block hidden absolute inset-0 bg-gray-55 rounded-lg cursor-pointer"
                  @click="downloadIcon(lightIcon)"
                >
                  <font-awesome-icon
                    class="text-base text-shark-50 absolute right-0 top-0 -translate-x-5 translate-y-4"
                    :icon="['fas', 'download']"
                  />
                </div>
              </div>
              <div
                v-if="shouldShowCarousels"
                class="group-hover:block hidden absolute -left-9 -bottom-6 bg-shark-950"
              >
                <span class="text-nowrap text-sm rounded-sm p-1 bg-gray-55">
                  Edit light mode icon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span
        class="pl-2 mt-4 block cursor-pointer text-shark-400 hover:text-shark-300 font-medium w-fit"
        @click="handleStep"
      >
        <font-awesome-icon :icon="['fas', 'upload']" />
        Upload custom icon
      </span>
    </div>
    <FileUpload
      v-if="step === 2"
      @handle-step="handleStep"
      @icon-uploaded="handleInitialIcon"
      @light-icon-changed="handleLightIconChanged"
      @dark-icon-changed="handleDarkIconChanged"
    />
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue'

export default {
  components: {
    FileUpload
  },
  props: {
    faviconURL: String,
    brandFetchIcons: Array,
    initialIcons: Array
  },
  data() {
    return {
      step: 1,
      allIcons: [],
      lightIcon: '',
      darkIcon: '',
      activeIconDark: '',
      activeIconLight: '',
      currentLightIndex: 0,
      currentDarkIndex: 0,
      showLightCarousel: false,
      firstIndex: 0,
      visibleIconsCount: 5
    }
  },
  computed: {
    shouldShowCarousels() {
      return this.allIcons.length > 1
    },
    shouldShowNavigationButtons() {
      return this.allIcons.length > this.visibleIconsCount
    },
    showDarkCarousel() {
      return !this.showLightCarousel && this.shouldShowCarousels
    },
    isFirstDarkIcon() {
      return this.currentDarkIndex === this.firstIndex
    },
    isLastDarkIcon() {
      return (
        this.currentDarkIndex === this.allIcons.length - this.visibleIconsCount
      )
    },
    isFirstLightIcon() {
      return this.currentLightIndex === this.firstIndex
    },
    isLastLightIcon() {
      return this.currentLightIndex === this.allIcons.length - this.visibleIconsCount
    }
  },
  watch: {
    brandFetchIcons: {
      immediate: true,
      handler(newVal) {
        this.allIcons = newVal.length ? newVal : [this.faviconURL]
      }
    },
    initialIcons: {
      immediate: true,
      handler(newVal) {
        if (newVal.length === 2) {
          this.lightIcon = newVal[1]
          this.darkIcon = newVal[0]
          this.activeIconLight = newVal[1]
          this.activeIconDark = newVal[0]
        } else if (newVal.length === 1) {
          this.lightIcon = newVal[0]
          this.darkIcon = newVal[0]
          this.activeIconLight = newVal[0]
          this.activeIconDark = newVal[0]
        } else if (this.faviconURL) {
          this.lightIcon = this.faviconURL
          this.darkIcon = this.faviconURL
        } else {
          this.handleStep()
        }
      }
    }
  },
  methods: {
    // TODO: GYUNAY Tech-choices V2
    // handleActiveIcon(icon, type) {
    //   if (type === 'light') {
    //     this.activeIconLight = icon
    //     this.lightIcon = icon
    //   }
    //   else {
    //     this.activeIconDark = icon
    //     this.darkIcon = icon
    //   }
    // },
    async downloadIcon(icon) {
      try {
        const response = await fetch(icon)
        const blob = await response.blob()

        const url = new URL(icon)
        const fileName = url.pathname.split('/').pop()

        const objectUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = objectUrl
        link.download = fileName

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(objectUrl)
      } catch (error) {
        console.error('Error downloading the icon:', error)
      }
    },
    handleStep() {
      this.step = this.step === 1 ? 2 : 1
    },
    handleInitialIcon(uploadLightIcon) {
      this.lightIcon = uploadLightIcon
    },
    handleLightIconChanged(lightIcon) {
      this.lightIcon = lightIcon
    },
    handleDarkIconChanged(darkIcon) {
      this.darkIcon = darkIcon
    },
    updateIndex(type, direction) {
      if (type === 'light') {
        const newIndex = this.currentLightIndex + direction
        if (
          newIndex >= this.firstIndex
          && newIndex <= this.allIcons.length - this.visibleIconsCount
        ) {
          this.currentLightIndex = newIndex
        }
      } else {
        const newIndex = this.currentDarkIndex + direction
        if (
          newIndex >= this.firstIndex
          && newIndex <= this.allIcons.length - this.visibleIconsCount
        ) {
          this.currentDarkIndex = newIndex
        }
      }
    },
    toggleCarousel(type) {
      this.showLightCarousel = type === 'light'
    },
    next(type) {
      this.updateIndex(type, 1)
    },
    prev(type) {
      this.updateIndex(type, -1)
    }
  }
}
</script>

<style scoped>
.carousel {
  display: flex;
  transition: transform 0.5s ease-in-out;
  gap: 4px;
}
.carousel-container {
  position: relative;
  overflow: hidden;
}

.expander {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition:
    grid-template-rows 0.5s,
    transform 0.5s ease-in-out;
}

.expanded-dark,
.expanded-light {
  grid-template-rows: 1fr;
  transform: translateX(0);
}

.expanded-dark .expander-content,
.expanded-light .expander-content {
  visibility: visible;
  height: 100%;
}

.expander.collapsed-dark {
  grid-template-rows: 0fr;
  transform: translateX(-80%);
}

.expander.collapsed-light {
  grid-template-rows: 0fr;
  transform: translateX(80%);
}
</style>
