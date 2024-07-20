import puppeteer from 'puppeteer'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

export default async function (url: string) {
  let browser
  try {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 720 })
    await page.goto(url, { waitUntil: 'networkidle2' })

    const imageBase64 = await page.screenshot({
      encoding: 'base64',
    })

    const chat = new ChatOpenAI({
      model: 'gpt-4o',
      maxTokens: 1280,
    }).bind({
      response_format: {
        type: 'json_object',
      },
    })

    const message = new HumanMessage({
      content: [
        {
          type: 'text',
          text: 'You are a specialized GPT designed to analyze images of technology websites to determine the primary color theme. When an image is provided in base64 format, first focus on the logo typically located on the navbar to identify its primary color. If the logo color is not one of the specified options or is predominantly white or black, analyze the overall color theme of the website. Choose the closest match from the following options: Blue, Dark Blue, Pink, Purple, Green, Yellow, Orange, Red, Beaver, Black, White. The response should be a valid JSON object with a key of \'colourTheme\' and the value being the selected color.',
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${imageBase64}`,
          },
        },
      ],
    })

    const res = await chat.invoke([message])

    const content = res.content
    const data = JSON.parse(content)
    return { data }
  }
  catch (error) {
    console.error('Error during processing:', error)
    throw new Error('Error processing website color theme')
  }
  finally {
    if (browser) {
      await browser.close()
    }
  }
}
