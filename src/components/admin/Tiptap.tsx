import { useEditor, EditorContent, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TTImage from '@tiptap/extension-image'
import axios from 'axios';
import { useS3Upload } from "next-s3-upload"

export default function Tiptap(props: { updater: (arg0: string) => void; }) {

let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TTImage,
    ],
    content: '<p>Hello World! 🌎️</p>',
    onUpdate({ editor }) {
        const content = editor.getHTML()
        props.updater(content);
    },
    editorProps: {
        handleDrop: function(view, event, slice, moved) {
          if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
            let file = event.dataTransfer.files[0]; // the dropped file

            let handleFileChange = async (file: any) => {
                let { url } = await uploadToS3(file);

                // place the now uploaded image in the editor where it was dropped
                const { schema } = view.state;
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                const node = schema.nodes.image.create({ src: url }); // creates the image element
                const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position

                // Dispatch the transaction to update the editor state
                view.dispatch(transaction);
            }

            handleFileChange(file)
            
            }
            return true; // handled
          }
      },
})

  const MenuBar = () => {  
        
    if (!editor) {
      return null
    }
  
    return (
      <div className='tiptapMenu'>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          Headline
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
            !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={editor.isActive('bold') ? 'is-active' : ''}
        >
            bold
        </button>
        <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
            !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={editor.isActive('italic') ? 'is-active' : ''}
        >
            italic
        </button>
        <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
            code block
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
            bullet list
        </button>
        <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
            ordered list
        </button>
        <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
            blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
            hard break
        </button>
      </div>

    )
  }

  return (
    <div className='postEditor'>
        <MenuBar/>
        <div className='tiptapEditor'>
          <EditorContent editor={editor} />   
        </div>
    </div>

  )
}

