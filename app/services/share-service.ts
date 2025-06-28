import { doc, collection, getDocs, query, where, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export const shareFile = async (file: any, targetEmail: string, permission: string, user: any, userData?: any) => {
  if (!targetEmail || !file) {
    throw new Error("Se requiere un correo electrónico y un archivo para compartir")
  }

  try {
    const normalizedEmail = targetEmail.toLowerCase().trim()

    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", normalizedEmail))
    const querySnapshot = await getDocs(q)

    let targetUserId: string
    let targetUserData: { name?: string } = {}

    if (querySnapshot.empty) {
      targetUserId = normalizedEmail.replace(/[.@]/g, "_")

      await setDoc(doc(db, "users", targetUserId), {
        email: normalizedEmail,
        name: "",
        phone: "",
        createdAt: serverTimestamp(),
        isTemporary: true,
      })
    } else {
      targetUserId = querySnapshot.docs[0].id
      targetUserData = querySnapshot.docs[0].data()

      if (targetUserId === user.uid) {
        throw new Error("No puedes compartir un archivo contigo mismo")
      }
    }

    const sharedId = `${file.id}_${Date.now()}`

    const sharedFileData = {
      fileId: file.id,
      fileName: file.name,
      fileUrl: file.url,
      ownerId: user.uid,
      ownerEmail: user.email,
      ownerName: userData?.name || "",
      permission: permission,
      sharedAt: serverTimestamp(),
      size: file.size,
      type: file.type,
      extension: file.extension,
      createdAt: file.createdAt,
    }

    await setDoc(doc(db, "users", targetUserId, "sharedWithMe", sharedId), sharedFileData)

    await setDoc(doc(db, "users", user.uid, "sharedByMe", sharedId), {
      ...sharedFileData,
      targetUserId: targetUserId,
      targetUserEmail: normalizedEmail,
      targetUserName: targetUserData.name || "",
    })

    return {
      success: true,
      message: `Archivo compartido con ${targetEmail} exitosamente`,
      isTemporaryUser: querySnapshot.empty,
    }
  } catch (error) {
    console.error("Error al compartir archivo:", error)
    throw error
  }
}
