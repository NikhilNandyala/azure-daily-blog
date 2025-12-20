'use client'

import { useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// Import common language support
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-dart'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-nginx'
import 'prismjs/components/prism-hcl'

interface CodeBlockProps {
  value: {
    code: string
    language?: string
    filename?: string
  }
}

export function CodeBlock({ value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { code, language = 'javascript', filename } = value

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Map language aliases to Prism language identifiers
  const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    shell: 'bash',
    powershell: 'powershell',
    dockerfile: 'docker',
    terraform: 'hcl',
  }

  const prismLanguage = languageMap[language] || language

  // Highlight code using Prism
  const highlightedCode = Prism.languages[prismLanguage]
    ? Prism.highlight(code, Prism.languages[prismLanguage], prismLanguage)
    : code

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-700 bg-[#1d1f21]">
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-[#282a2e] px-4 py-2">
        <div className="flex items-center gap-2">
          {filename && <span className="font-mono text-sm text-gray-300">{filename}</span>}
          {!filename && language && (
            <span className="font-mono text-xs text-gray-400 uppercase">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-gray-700"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg
                className="h-4 w-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="!my-0 !bg-transparent p-4">
          <code
            className={`language-${prismLanguage} !text-sm`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  )
}
