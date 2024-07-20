import { addDoc, collection } from 'firebase/firestore'
import { defineEventHandler, readBody, createError } from 'h3'
import { firestoreDB } from '../firebase'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body || typeof body !== 'object') {
      throw createError({ statusCode: 400, message: 'Invalid data format.' })
    }
    body.status = 'Pending Approval'
    const collectionRef = collection(firestoreDB, 'tech-choice')
    await addDoc(collectionRef, body)

    return {
      status: 200
    }
  } catch (error) {
    console.error('Error:', error)
    return createError({ statusCode: 500, message: error.message })
  }
})
