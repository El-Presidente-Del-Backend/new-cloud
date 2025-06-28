import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { doc, collection, deleteDoc, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore"
import { storage, db } from "../firebase/firebaseConfig"
import { getFileTypeFromName } from "../utils/file-utils"

const SUCCESS_MESSAGES = {
  DELETE: "Archivo eliminado con éxito",
}

export const uploadFile = async (file: File, user: any, selectedFolderId: string | null) => {
  if (!file) return null

  const filesRef = collection(db, "users", user.uid, "files")
  const q = query(filesRef, where("folderId", "==", selectedFolderId || null))
  const snapshot = await getDocs(q)

  const filesInFolder = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    url: doc.data().url,
  }))

  const existing = filesInFolder.find((f) => f.name === file.name)
  let finalName = file.name

  if (existing) {
    const shouldOverwrite = window.confirm(`Ya existe un archivo llamado "${file.name}".\n¿Quieres sobrescribirlo?`)

    if (shouldOverwrite) {
      await deleteObject(ref(storage, `files/${user.uid}/${existing.name}`))
      await deleteDoc(doc(db, "users", user.uid, "files", existing.id))
    } else {
      const names = filesInFolder.map((f) => f.name)
      finalName = generateCopyName(names, file.name)
    }
  }

  return await completeFileUpload(file, finalName, user, selectedFolderId)
}

const completeFileUpload = async (file: File, finalName: string, user: any, selectedFolderId: string | null) => {
  const fileRef = ref(storage, `files/${user.uid}/${finalName}`)
  const snap = await uploadBytes(fileRef, file)
  const url = await getDownloadURL(snap.ref)

  const fileExtension = finalName.split(".").pop()?.toLowerCase() || ""
  const fileType = getFileTypeFromName(finalName)

  const fileData = {
    name: finalName,
    url,
    folderId: selectedFolderId || null,
    createdAt: serverTimestamp(),
    ownerId: user.uid,
    ownerEmail: user.email,
    size: file.size,
    type: fileType,
    extension: fileExtension,
  }

  const filesRef = collection(db, "users", user.uid, "files")
  const docRef = await addDoc(filesRef, fileData)

  return {
    id: docRef.id,
    ...fileData,
  }
}

export const deleteFile = async (file: any, user: any) => {
  try {
    if (file.isShared) {
      await deleteDoc(doc(db, "users", user.uid, "sharedWithMe", file.id))
      return SUCCESS_MESSAGES.DELETE
    }

    const fileRef = ref(storage, `files/${user.uid}/${file.name}`)
    await deleteObject(fileRef)
    await deleteDoc(doc(db, "users", user.uid, "files", file.id))

    const sharedByMeRef = collection(db, "users", user.uid, "sharedByMe")
    const q = query(sharedByMeRef, where("fileId", "==", file.id))
    const snapshot = await getDocs(q)

    const deletePromises = snapshot.docs.map(async (docSnap) => {
      const sharedData = docSnap.data()
      await deleteDoc(doc(db, "users", sharedData.targetUserId, "sharedWithMe", docSnap.id))
      await deleteDoc(doc(db, "users", user.uid, "sharedByMe", docSnap.id))
    })

    await Promise.all(deletePromises)

    return SUCCESS_MESSAGES.DELETE
  } catch (error) {
    console.error("Error al eliminar archivo:", error)
    throw error
  }
}

const generateCopyName = (existingNames: string[], originalName: string) => {
  const nameParts = originalName.split(".")
  const extension = nameParts.pop()
  const baseName = nameParts.join(".")

  let copyNum = 1
  let newName = `${baseName} (${copyNum}).${extension}`

  while (existingNames.includes(newName)) {
    copyNum++
    newName = `${baseName} (${copyNum}).${extension}`
  }

  return newName
}
