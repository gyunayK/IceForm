<template>
  <div class="w-full max-w-lg mx-auto bg-shark-950 px-10 py-6 rounded-md">
    <h2 class="text-2xl font-bold font-roboto text-white">
      {{
        step === 1
          ? 'Add new technology'
          : step === 2
            ? 'Checking new technology choice'
            : 'Technology choice request'
      }}
    </h2>
    <button class="text-sm cursor-pointer rounded-md text-shark-400 mt-2" @click="prevStep">
      <font-awesome-icon :icon="['fas', 'arrow-left']" />
      Back
    </button>
    <form v-if="step === 1" class="mt-6 flex flex-col gap-2" @submit.prevent="handleTechCheck">
      <div>
        <label :for="id" class="text-xs text-shark-400 mb-1 block"> Website URL </label>
        <div class="relative">
          <font-awesome-icon
            :icon="['fas', 'globe']"
            class="absolute left-0 top-0 ml-3 mt-2"
            :class="{
              'text-lightred': formErrors.technologyUrl,
              'text-shark-400': !formErrors.technologyUrl
            }"
          />
          <input
            :id="'website-url'"
            v-model="inputValue"
            :placeholder="'e.g. icepanel.io'"
            class="px-9 pt-1.5 w-full h-8 text-shark-50 text-sm rounded border-0 ring-1 ring-inset bg-gray-50 ring-shark-700 focus:ring-spray-300"
            :class="[
              formErrors.technologyUrl
                ? 'border border-lightred placeholder:text-lightred'
                : 'placeholder:text-shark-400'
            ]"
            @input="onChangeUrl($event.target.value)"
          />
          <p v-if="formErrors.technologyUrl" class="text-sm text-lightred">
            {{ formErrors.technologyUrl }}
          </p>
        </div>
      </div>
      <button
        type="submit"
        class="w-1/2 flex justify-center items-center gap-2 mt-2 ml-auto rounded bg-spray-300 hover:bg-spray-200 py-2.5 text-sm font-semibold text-shark-950 shadow-sm"
      >
        Check technology choice
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="scale-110" />
      </button>
    </form>
    <div v-if="step === 2" class="flex flex-col text-shark-400">
      <div class="min-h-72 flex justify-center items-center gap-4">
        <img src="/loading.gif" alt="loadingGif" class="h-9 w-9 object-contain" />
        <p class="text-shark-400 text-xl">Creating details for you...</p>
      </div>
      <button
        class="flex items-center justify-center gap-2.5 font-roboto font-medium text-shark-400 py-3 px-5 rounded-md disabled:bg-shark-800 ml-auto"
        disabled
      >
        Next
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="scale-110" />
      </button>
    </div>

    <form v-if="step === 3" class="space-y-4 mt-6" @submit.prevent="handleTechSubmit">
      <UrlInput
        id="url"
        v-model="form.technologyUrl"
        label="Details we found using:"
        placeholder="e.g. icepanel.io"
        icon="globe"
        main
        :error-message="formErrors.technologyUrl"
      />
      <div class="h-px w-full bg-shark-700 rounded-md" />
      <TechnologyNameInput
        v-model="form.technologyName"
        :error-message="formErrors.technologyName"
        @update:error-message="formErrors.technologyName = $event"
      />
      <Icon
        :favicon-u-r-l="form.faviconURL"
        :brand-fetch-icons="form.brandFetchIcons"
        :initial-icons="form.initialIcons"
      />
      <UrlInput
        id="docs-url"
        v-model="form.docsUrl"
        label="Docs URL"
        placeholder="e.g. docs.icepanel.io"
        icon="books"
        :error-message="formErrors.docsUrl"
      />
      <UrlInput
        id="Update-url"
        v-model="form.updateUrl"
        label="Change log"
        placeholder="e.g. icepanel.io/release-notes"
        icon="clock"
        :error-message="formErrors.updateUrl"
      />
      <DescriptionTextarea v-model="form.description" :error-message="formErrors.description" />
      <C4ModelDropdown v-model="form.c4ModelAbstraction" :error-message="formErrors.c4ModelAbstraction" />
      <color-dropdown v-model="form.theme" />
      <div class="flex justify-end">
        <button
          type="submit"
          class="flex justify-center items-center gap-2 rounded-md bg-spray-300 hover:bg-spray-200 py-3 px-3 text-base font-roboto font-medium text-shark-950 disabled:opacity-50"
          :disabled="Object.keys(formErrors).length > 0"
        >
          Save
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ZodError } from 'zod'
import { technologyFormSchema } from '../utils/formValidationSchema'
import TechnologyNameInput from './NameInput.vue'
import DescriptionTextarea from './DescriptionInput.vue'
import UrlInput from './UrlInput.vue'
import ColorDropdown from './ColorDropdown.vue'
import C4ModelDropdown from './C4ModelDropdown.vue'
import Icon from './IconsView.vue'

export default {
  components: {
    UrlInput,
    ColorDropdown,
    TechnologyNameInput,
    DescriptionTextarea,
    C4ModelDropdown,
    Icon
  },

  data() {
    return {
      formErrors: {},
      step: 1,
      form: {
        technologyUrl: '',
        technologyName: '',
        description: '',
        docsUrl: '',
        updateUrl: '',
        theme: '',
        lightIcon: '',
        darkIcon: '',
        c4ModelAbstraction: [],
        brandFetchIcons: [],
        initialIcons: [],
        faviconURL: ''
      }
    }
  },
  watch: {
    form: {
      handler() {
        this.validateForm()
      },
      deep: true
    }
  },
  methods: {
    onChangeUrl(value) {
      this.form.technologyUrl = value
    },
    handleHomePage() {
      this.$router.push('/')
    },
    handleInitialIcon(url) {
      this.form.lightIcon = url
      this.form.darkIcon = url
    },
    handleLightIconChanged(url) {
      this.form.lightIcon = url
    },
    handleDarkIconChanged(url) {
      this.form.darkIcon = url
    },
    nextStep() {
      this.step++
    },
    prevStep() {
      this.step--
      switch (this.step) {
        case 0:
          this.$router.push('/')
          break
        case 2:
          this.step = 1
          break
      }
    },
    extractSrcByPriority(logoArr = []) {
      const allSrcs = []
      const initialIcons = []

      const findPreferredFormat = (formats) =>
        formats.find((f) => f.format === 'svg') || formats.find((f) => f.format === 'png')

      let foundLightIcon = false
      let foundDarkIcon = false

      // Single loop to collect all srcs and determine initial icons
      for (const logo of logoArr) {
        const format = findPreferredFormat(logo.formats)
        if (format) {
          allSrcs.push(format.src)
          if (!foundLightIcon && logo.theme === 'light' && logo.type === 'icon') {
            initialIcons.push(format.src)
            foundLightIcon = true
          } else if (!foundDarkIcon && logo.theme === 'dark' && logo.type === 'icon') {
            initialIcons.push(format.src)
            foundDarkIcon = true
          }
          if (foundLightIcon && foundDarkIcon) {
            break
          }
        }
      }
      // If initialIcons is still empty, check for logos
      if (initialIcons.length === 0) {
        for (const logo of logoArr) {
          const format = findPreferredFormat(logo.formats)
          if (format) {
            if (!foundLightIcon && logo.theme === 'light' && logo.type === 'logo') {
              initialIcons.push(format.src)
              foundLightIcon = true
            } else if (!foundDarkIcon && logo.theme === 'dark' && logo.type === 'logo') {
              initialIcons.push(format.src)
              foundDarkIcon = true
            }
            if (foundLightIcon && foundDarkIcon) {
              break
            }
          }
        }
      }
      return { allSrcs, initialIcons }
    },
    async handleTechCheck() {
      this.validateForm()
      this.nextStep()
      try {
        const { data } = await useFetch('/api/form', {
          method: 'POST',
          body: { url: this.form.technologyUrl }
        })
        const finalData = data.value.body
        if (finalData && finalData.name) {
          const extractedData = this.extractSrcByPriority(finalData.brandfetchData.logos)
          this.form.technologyName = finalData.name
          this.form.description = finalData.desc
          this.form.docsUrl = finalData.docs
          this.form.updateUrl = finalData.updateUrl
          this.form.theme = finalData.colourTheme
          this.form.c4ModelAbstraction = [finalData.c4ModelAbstraction]
          this.form.brandFetchIcons = extractedData.allSrcs
          this.form.initialIcons = extractedData.initialIcons
          this.form.faviconURL = finalData.faviconUrl
          this.validateForm()
          this.nextStep()
        } else {
          this.prevStep()
        }
      } catch (error) {
        this.prevStep()
      }
    },
    async handleTechSubmit() {
      if (!this.validateForm()) return
      const formData = {
        technologyUrl: this.form.technologyUrl,
        technologyName: this.form.technologyName,
        description: this.form.description,
        docsUrl: this.form.docsUrl,
        updateUrl: this.form.updateUrl,
        theme: this.form.theme,
        c4ModelAbstraction: this.form.c4ModelAbstraction,
        status: this.form.status,
        faviconURL: this.form.faviconURL
      }
      const { data } = await useFetch('/api/tech', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (data.value.status === 200) {
        this.handleHomePage()
      } else {
        this.formErrors = data.errors
      }
    },
    validateForm() {
      this.formErrors = {}
      let isValid = true
      const formData = {
        technologyUrl: this.form.technologyUrl,
        technologyName: this.form.technologyName,
        description: this.form.description,
        docsUrl: this.form.docsUrl,
        updateUrl: this.form.updateUrl,
        theme: this.form.theme,
        c4ModelAbstraction: this.form.c4ModelAbstraction
      }
      try {
        technologyFormSchema.parse(formData)
      } catch (error) {
        if (error instanceof ZodError) {
          error.errors.forEach((err) => {
            this.formErrors[err.path[0]] = err.message
          })
        }
        isValid = false
      }
      return isValid
    }
  }
}
</script>
