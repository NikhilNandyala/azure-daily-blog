'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
}

/**
 * MermaidDiagram - Renders Mermaid diagrams from markdown code blocks
 *
 * Usage:
 * ```mermaid
 * graph TD
 *   A[Start] --> B[Process]
 *   B --> C[End]
 * ```
 */
export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Initialize Mermaid with dark theme
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#60a5fa',
        lineColor: '#94a3b8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#334155',
        background: '#0f172a',
        mainBkg: '#1e293b',
        secondBkg: '#334155',
        edgeLabelBackground: '#1e293b',
        nodeTextColor: '#fff',
        clusterBkg: '#1e293b',
        clusterBorder: '#475569',
        defaultLinkColor: '#94a3b8',
        titleColor: '#fff',
        actorBorder: '#60a5fa',
        actorBkg: '#1e293b',
        actorTextColor: '#fff',
        actorLineColor: '#94a3b8',
        signalColor: '#94a3b8',
        signalTextColor: '#fff',
        labelBoxBkgColor: '#1e293b',
        labelBoxBorderColor: '#475569',
        labelTextColor: '#fff',
        loopTextColor: '#fff',
        noteBorderColor: '#60a5fa',
        noteBkgColor: '#1e293b',
        noteTextColor: '#fff',
        activationBorderColor: '#60a5fa',
        activationBkgColor: '#1e293b',
        sequenceNumberColor: '#fff',
        sectionBkgColor: '#1e293b',
        altSectionBkgColor: '#334155',
        sectionBkgColor2: '#475569',
        excludeBkgColor: '#64748b',
        taskBorderColor: '#60a5fa',
        taskBkgColor: '#1e293b',
        taskTextColor: '#fff',
        taskTextLightColor: '#fff',
        taskTextOutsideColor: '#fff',
        taskTextClickableColor: '#3b82f6',
        activeTaskBorderColor: '#60a5fa',
        activeTaskBkgColor: '#3b82f6',
        gridColor: '#475569',
        doneTaskBkgColor: '#059669',
        doneTaskBorderColor: '#10b981',
        critBorderColor: '#dc2626',
        critBkgColor: '#991b1b',
        todayLineColor: '#dc2626',
        git0: '#3b82f6',
        git1: '#8b5cf6',
        git2: '#ec4899',
        git3: '#f59e0b',
        git4: '#10b981',
        git5: '#06b6d4',
        git6: '#ef4444',
        git7: '#84cc16',
        gitBranchLabel0: '#fff',
        gitBranchLabel1: '#fff',
        gitBranchLabel2: '#fff',
        gitBranchLabel3: '#fff',
        gitBranchLabel4: '#fff',
        gitBranchLabel5: '#fff',
        gitBranchLabel6: '#fff',
        gitBranchLabel7: '#fff',
        commitLabelColor: '#fff',
        commitLabelBackground: '#1e293b',
        tagLabelColor: '#fff',
        tagLabelBackground: '#1e293b',
        tagLabelBorder: '#60a5fa',
        tagLabelFontSize: '10px',
        attributeBackgroundColorOdd: '#1e293b',
        attributeBackgroundColorEven: '#334155',
      },
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: 16,
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        padding: 15,
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: true,
        rightAngles: false,
        showSequenceNumbers: false,
      },
      gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        barGap: 4,
        topPadding: 50,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        numberSectionStyles: 4,
        axisFormat: '%Y-%m-%d',
      },
    })

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
        setError('')
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-red-500/50 bg-red-900/20 p-4">
        <div className="mb-2 text-sm font-semibold text-red-400">Mermaid Rendering Error</div>
        <pre className="overflow-x-auto text-xs text-red-300">{error}</pre>
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-red-400 hover:text-red-300">
            Show diagram code
          </summary>
          <pre className="mt-2 overflow-x-auto rounded bg-gray-900 p-2 text-xs text-gray-300">
            {chart}
          </pre>
        </details>
      </div>
    )
  }

  return (
    <div className="my-8 flex justify-center">
      <div
        ref={ref}
        className="mermaid-diagram overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-6"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  )
}
