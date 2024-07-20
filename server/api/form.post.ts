import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import axios from 'axios'
import fetchBrandData from '../utils/fetchBrand'
import analyzeColorTheme from '../utils/analyzeColorTheme'

type TechMetadata = {
  name: string
  desc: string
  docs: string
  colourTheme: string
  updateUrl: string
  c4ModelAbstraction: string
  faviconUrl: string
  brandfetchData: any
}

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  const config = useRuntimeConfig()

  if (!url) {
    return {
      status: 400,
      body: 'No URL provided'
    }
  }

  const apiKeyFromEnv = config.openAiKey

  const loader = new CheerioWebBaseLoader(url)
  const urlContent = await loader.load()

  const splitter = new RecursiveCharacterTextSplitter()
  const splitDocs = await splitter.splitDocuments(urlContent)

  const embeddings = new OpenAIEmbeddings({ apiKey: apiKeyFromEnv })
  const vectorstore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)

  const chatModel = new ChatOpenAI({
    apiKey: apiKeyFromEnv,
    model: 'gpt-4o',
    maxTokens: 1280
  }).bind({
    response_format: {
      type: 'json_object'
    }
  })

  const prompt = ChatPromptTemplate.fromTemplate(`
    The GPT will automatically browse to a provided link, extract information specifically about a technology, and generate metadata including the name of the technology, a concise 120-character description, the URL to the technology’s documentation (or an empty string if not found). Additionally, it will identify and provide the URL to the update or changelog page (or an empty string if not found), which should be found in the metadata of the page. It will specifically look for GitHub links when identifying changelog or update URLs, acknowledging that these are frequently used for version updates and release notes. The GPT will focus exclusively on the factual aspects of the technology, effectively filtering out any marketing language or promotional content to provide an objective summary. When searching for documentation or update URLs, the GPT will recognize variations like 'docs,' 'documentation,' 'release notes,' 'technology,' or other relevant terms. It will ensure greater accuracy in identifying actual documentation URLs, specifically avoiding returning the initial URL provided unless it clearly serves as the documentation page. It will exercise greater caution in ensuring accuracy and relevancy, particularly verifying the technology specified in the URL matches the information extracted. The results will be formatted into a valid JSON, providing structured outputs with keys for 'name,' 'desc,' 'docs,' 'updateUrl,' 'c4ModelAbstraction', and 'faviconUrl', where 'c4ModelAbstraction' will include an educated guess from options like "Software System", "App", "Store", "Component", "Connection" based on the context of the technology. 'faviconUrl' will include the URL to the favicon found within the website's HTML metadata. Whenever a URL is provided, the GPT will automatically initiate browsing to extract the required information without needing explicit instructions to do so.
          <context>
          {context}
          </context>

          Question: {input}`)
  const documentChain = await createStuffDocumentsChain({
    llm: chatModel,
    prompt
  })

  const retriever = vectorstore.asRetriever()
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: documentChain,
    retriever
  })

  const result = await retrievalChain.invoke({
    input: url
  })

  let parsedAnswer: TechMetadata = {
    name: '',
    desc: '',
    docs: '',
    colourTheme: '',
    updateUrl: '',
    c4ModelAbstraction: '',
    faviconUrl: '',
    brandfetchData: {}
  }

  try {
    parsedAnswer = JSON.parse(result.answer)
  } catch (error) {
    throw new Error('Error parsing GPT-4 response')
  }

  try {
    const { docs, updateUrl, faviconUrl } = parsedAnswer

    const promises = [
      axios.head(docs),
      axios.head(updateUrl),
      axios.get(faviconUrl),
      fetchBrandData(url),
      analyzeColorTheme(url)
    ]

    const results = await Promise.allSettled(promises)

    const [docsResponse, updateResponse, faviconResponse, brandfetchResponse, analyzeColorThemeResponse] =
      results

    parsedAnswer.docs = docsResponse.status === 'fulfilled' && docsResponse.value.status === 200 ? docs : ''
    parsedAnswer.updateUrl =
      updateResponse.status === 'fulfilled' && updateResponse.value.status === 200 ? updateUrl : ''
    parsedAnswer.faviconUrl = faviconResponse.status === 'fulfilled' ? faviconUrl : ''
    parsedAnswer.brandfetchData =
      brandfetchResponse.status === 'fulfilled' ? brandfetchResponse.value.data : {}
    parsedAnswer.colourTheme =
      analyzeColorThemeResponse.status === 'fulfilled' ? analyzeColorThemeResponse.value.data.colourTheme : ''
  } catch (error) {
    throw new Error('Error fetching documentation, update URLs, or favicon')
  }

  return {
    status: 200,
    body: parsedAnswer
  }
})
