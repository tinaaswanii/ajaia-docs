import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import Editor from '../components/Editor'

function Dashboard() {
  const [documents, setDocuments] = useState([])
  const [sharedDocs, setSharedDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(null)
  const [shareEmail, setShareEmail] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    const user = (await supabase.auth.getUser()).data.user

    if (!user) return

    // OWNED DOCUMENTS
    const { data: owned } = await supabase
      .from('documents')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    setDocuments(owned || [])

    // SHARED DOCUMENT IDS
    const { data: sharedRows } = await supabase
      .from('shared_documents')
      .select('*')
      .eq('shared_with', user.id)

    if (!sharedRows || sharedRows.length === 0) {
      setSharedDocs([])
      return
    }

    const docIds = sharedRows.map(
      (row) => row.document_id
    )

    // FETCH SHARED DOCUMENTS
    const { data: sharedDocsData } = await supabase
      .from('documents')
      .select('*')
      .in('id', docIds)

    setSharedDocs(sharedDocsData || [])
  }

  const createDocument = async () => {
    const user = (await supabase.auth.getUser()).data.user

    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          title: 'Untitled Document',
          content: {},
          owner_id: user.id,
        },
      ])
      .select()

    if (error) {
      alert(error.message)
      return
    }

    fetchDocuments()
    openDocument(data[0])
  }

  const openDocument = (doc) => {
    setSelectedDoc(doc)
    setTitle(doc.title)
    setContent(doc.content)
  }

  const saveDocument = async () => {
    if (!selectedDoc) return

    const { error } = await supabase
      .from('documents')
      .update({
        title,
        content,
      })
      .eq('id', selectedDoc.id)

    if (error) {
      alert(error.message)
      return
    }

    fetchDocuments()

    alert('Document Saved!')
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]

    if (!file) return

    const text = await file.text()

    const user = (await supabase.auth.getUser()).data.user

    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          title: file.name,
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: text,
                  },
                ],
              },
            ],
          },
          owner_id: user.id,
        },
      ])
      .select()

    if (error) {
      alert(error.message)
      return
    }

    fetchDocuments()
    openDocument(data[0])
  }

  const shareDocument = async () => {
    if (!selectedDoc || !shareEmail) return

    const cleanEmail = shareEmail.trim().toLowerCase()

    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', cleanEmail)

    if (error) {
      alert(error.message)
      return
    }

    if (!users || users.length === 0) {
      alert('User not found')
      return
    }

    const userToShare = users[0]

    const { error: shareError } = await supabase
      .from('shared_documents')
      .insert([
        {
          document_id: selectedDoc.id,
          shared_with: userToShare.id,
        },
      ])

    if (shareError) {
      alert(shareError.message)
      return
    }

    alert('Document Shared!')
    setShareEmail('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r p-4 overflow-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            Documents
          </h2>

          <div className="flex gap-2">

            <button
              onClick={createDocument}
              className="bg-black text-white px-3 py-1 rounded"
            >
              +
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Upload
            </button>

          </div>
        </div>

        <input
          type="file"
          accept=".txt,.md"
          ref={fileInputRef}
          onChange={handleFileUpload}
          hidden
        />

        {/* OWNED DOCS */}
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => openDocument(doc)}
              className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            >
              {doc.title}
            </div>
          ))}
        </div>

        {/* SHARED DOCS */}
        <h3 className="font-bold mt-6 mb-2">
          Shared With Me
        </h3>

        <div className="space-y-2">
          {sharedDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => openDocument(doc)}
              className="p-3 bg-blue-100 rounded cursor-pointer"
            >
              {doc.title}
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white w-full py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">

        {selectedDoc ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold mb-4 w-full border-none outline-none bg-transparent"
            />

            <Editor
              content={content}
              onChange={setContent}
            />

            <button
              onClick={saveDocument}
              className="mt-4 bg-black text-white px-6 py-2 rounded"
            >
              Save Document
            </button>

            {/* SHARE SECTION */}
            <div className="mt-6 flex gap-2">

              <input
                type="email"
                placeholder="Share with email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="border p-2 rounded w-72"
              />

              <button
                onClick={shareDocument}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Share
              </button>

            </div>
          </>
        ) : (
          <div className="text-gray-500">
            Select or create a document
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard