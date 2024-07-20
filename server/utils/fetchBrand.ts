import axios from 'axios'

const config = useRuntimeConfig()
const brandfetchApiKey = config.brandfetchKey

export default function (url: string) {
  const parsedUrl = new URL(url)
  const brandfetchUrl = `https://api.brandfetch.io/v2/brands/${parsedUrl.hostname}`

  return axios
    .get(brandfetchUrl, {
      headers: {
        Authorization: `Bearer ${brandfetchApiKey}`
      }
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error fetching brand data:', error)
      throw error
    })
}
