import { collection, getDocs } from 'firebase/firestore'
import { firestoreDB } from '../firebase'

export default defineEventHandler(async () => {
  const snapshot = await getDocs(collection(firestoreDB, 'tech-choice'))

  const finalData = snapshot.docs.map((doc) => ({
    technologyName: doc.data().technologyName,
    status: doc.data().status
  }))

  return {
    status: 200,
    body: finalData
  }
})
