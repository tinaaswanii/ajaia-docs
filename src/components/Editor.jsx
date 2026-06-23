import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useEffect } from 'react'

function Editor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="bg-white rounded shadow p-4">
      
      <div className="flex gap-2 border-b pb-3 mb-4 flex-wrap">
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="border px-3 py-1 rounded"
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="border px-3 py-1 rounded"
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="border px-3 py-1 rounded"
        >
          Underline
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="border px-3 py-1 rounded"
        >
          Bullet List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="border px-3 py-1 rounded"
        >
          H1
        </button>

      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor