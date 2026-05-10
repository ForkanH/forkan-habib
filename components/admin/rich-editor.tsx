'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading2, List, ListOrdered, Link as LinkIcon, Quote, Code } from 'lucide-react';

export function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Placeholder.configure({ placeholder: 'Write something brilliant…' })],
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: 'prose prose-invert max-w-none min-h-[300px] focus:outline-none p-4' } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  if (!editor) return null;
  const Btn = ({ active, onClick, children }: any) => (
    <Button 
      type="button" 
      variant={active ? 'accent' : 'ghost'} 
      size="icon" 
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </Button>
  );
  return (
    <div className="rounded-md border border-border">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border">
        <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4"/></Btn>
        <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4"/></Btn>
        <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4"/></Btn>
        <Btn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4"/></Btn>
        <Btn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4"/></Btn>
        <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4"/></Btn>
        <Btn active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="h-4 w-4"/></Btn>
        <Btn onClick={() => { const url = prompt('URL?'); if (url) editor.chain().focus().setLink({ href: url }).run(); }}><LinkIcon className="h-4 w-4"/></Btn>
      </div>
      <EditorContent editor={editor}/>
    </div>
  );
}
