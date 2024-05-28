import React, { useEffect, useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build'
import style from './CustomCKEditor.module.scss'
import { useTranslation } from '@refinedev/core'
import './ckeditor.css'
import 'ckeditor5-custom-build/build/translations/de'

interface customCKEditorProps {
  initialData: string | null
  currentLocale: string
  onChange: (data: string) => void
  isError: boolean
}

interface wordCountStats {
  words: number
  characters: number
}

export default function CustomCKEditor(props: customCKEditorProps) {
  const { currentLocale, initialData, onChange, isError } = props
  const [key, setKey] = useState(0)
  const editorRef = useRef(null)
  const { translate } = useTranslation()

  useEffect(() => {
    setKey((prev) => prev + 1)
  }, [currentLocale])

  const editorConfiguration = {
    language: currentLocale,
    // stylesの設定
    style: {
      definitions: [
        {
          name: 'Article category',
          element: 'h3',
          classes: ['category'],
        },
        {
          name: 'Title',
          element: 'h2',
          classes: ['document-title'],
        },
        {
          name: 'Subtitle',
          element: 'h3',
          classes: ['document-subtitle'],
        },
        {
          name: 'Code (dark)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-dark'],
        },
        {
          name: 'Code (bright)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-bright'],
        },
      ],
    },
    // codeBlockの言語設定
    codeBlock: {
      languages: [
        { language: 'plaintext', label: 'Plain text' },
        { language: 'shell', label: 'Shell' },
        { language: 'html', label: 'HTML' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'css', label: 'CSS' },
        { language: 'scss', label: 'SCSS' },
        { language: 'json', label: 'JSON' },
        { language: 'xml', label: 'XML' },
        { language: 'php', label: 'PHP' },
        { language: 'python', label: 'Python' },
        { language: 'java', label: 'Java' },
        { language: 'ruby', label: 'Ruby' },
        { language: 'csharp', label: 'C#' },
        { language: 'sql', label: 'SQL' },
        { language: 'yaml', label: 'YAML' },
      ],
    },
    // WordCountプラグインの設定
    wordCount: {
      onUpdate: (stats: wordCountStats) => {
        const words = stats.words
        const charactersCount = stats.characters
        const charactersCountElement = document.getElementById('charactersCount')
        if (currentLocale === 'ja') {
          if (charactersCountElement) {
            charactersCountElement.innerHTML = `${charactersCount}文字`
          }
        } else {
          const wordCountElement = document.getElementById('wordCount')
          if (wordCountElement) {
            wordCountElement.innerHTML = `${translate('posts.fields.contentWordsCount')} ${words}`
          }
          if (charactersCountElement) {
            charactersCountElement.innerHTML = `${translate('posts.fields.contentCharacterCount')} ${charactersCount}`
          }
        }
      },
    },
  }

  useEffect(() => {
    if (editorRef.current) {
      const editorContainer = (editorRef.current as any).editor.ui.view.element
      if (isError) {
        editorContainer.classList.add(style['editor-error'])
      } else {
        editorContainer.classList.remove(style['editor-error'])
      }
    }
  }, [isError])

  return (
    <>
      <CKEditor
        key={key}
        editor={Editor}
        config={editorConfiguration}
        data={initialData}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange(data)
        }}
        onReady={(editor) => {
          editorRef.current = { editor } as any
          // 入力時のデフォルトテキストカラーとエディタサイズを設定
          const view = editor.editing.view
          view.change((writer) => {
            const rootElement = editor.editing.view.document.getRoot()
            if (rootElement) {
              writer.setStyle('color', '#111111', rootElement)
              writer.setStyle('min-height', '500px', rootElement)
            }
          })

          const editorContainer = editor.ui.view.element
          if (isError) {
            editorContainer?.classList.add(style['editor-error'])
          } else {
            editorContainer?.classList.remove(style['editor-error'])
          }
        }}
      />
      <div className={`${style['count-wrapper']}`}>
        <span id='wordCount'></span>
        <span id='charactersCount'></span>
      </div>
    </>
  )
}
