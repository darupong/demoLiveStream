'use client'

import { useEffect } from 'react'
import { useLocale } from '@/lib/localeStore'
import { translate } from '@/lib/translations'

const ATTRIBUTES = ['aria-label', 'placeholder', 'title']
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA'])

// What React put in each node, and what we wrote over it. A difference means React updated it.
const originals = new WeakMap<Text, string>()
const written = new WeakMap<Text, string>()
const attrOriginals = new WeakMap<Element, Map<string, string>>()
const attrWritten = new WeakMap<Element, Map<string, string>>()
const tracked = new Set<Text>()
const trackedElements = new Set<Element>()

// React renders `ยก {a}/{b}` as several neighbouring text nodes, so they are translated together.
function textRuns(parent: Node) {
  const runs: Text[][] = []
  let run: Text[] = []
  for (const child of parent.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) run.push(child as Text)
    else if (child.nodeType !== Node.COMMENT_NODE) {
      if (run.length) runs.push(run)
      run = []
    }
  }
  if (run.length) runs.push(run)
  return runs
}

function translateRun(run: Text[]) {
  for (const node of run) {
    if (written.get(node) !== node.nodeValue) originals.set(node, node.nodeValue ?? '')
  }
  const source = run.map((node) => originals.get(node)).join('')
  const out = translate(source)
  run.forEach((node, i) => {
    const value = i === 0 ? out : ''
    written.set(node, value)
    if (node.nodeValue !== value) node.nodeValue = value
    tracked.add(node)
  })
}

function translateAttributes(element: Element) {
  for (const name of ATTRIBUTES) {
    const value = element.getAttribute(name)
    if (value === null) continue
    const sources = attrOriginals.get(element) ?? new Map<string, string>()
    const outputs = attrWritten.get(element) ?? new Map<string, string>()
    if (outputs.get(name) !== value) sources.set(name, value)
    const out = translate(sources.get(name)!)
    outputs.set(name, out)
    attrOriginals.set(element, sources)
    attrWritten.set(element, outputs)
    trackedElements.add(element)
    if (value !== out) element.setAttribute(name, out)
  }
}

function translateTree(root: Element) {
  if (SKIP.has(root.tagName)) return
  translateAttributes(root)
  textRuns(root).forEach(translateRun)
  for (const child of root.children) translateTree(child)
}

function restore() {
  for (const node of tracked) {
    if (node.isConnected && written.get(node) === node.nodeValue) node.nodeValue = originals.get(node) ?? ''
    written.delete(node)
  }
  tracked.clear()
  for (const element of trackedElements) {
    attrOriginals.get(element)?.forEach((value, name) => {
      if (attrWritten.get(element)?.get(name) === element.getAttribute(name)) element.setAttribute(name, value)
    })
    attrOriginals.delete(element)
    attrWritten.delete(element)
  }
  trackedElements.clear()
}

function onMutations(records: MutationRecord[]) {
  for (const record of records) {
    if (record.type === 'attributes') translateAttributes(record.target as Element)
    else if (record.type === 'characterData') {
      const parent = record.target.parentNode
      if (parent && !SKIP.has(parent.nodeName)) textRuns(parent).forEach(translateRun)
    } else {
      if (!SKIP.has(record.target.nodeName)) textRuns(record.target).forEach(translateRun)
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) translateTree(node as Element)
      }
    }
  }
}

// ponytail: rewrites rendered text so this mockup needs no per-string changes.
// The real product should render from message keys (next-intl) on the server.
export function Translator() {
  const locale = useLocale()

  useEffect(() => {
    document.documentElement.lang = locale
    const reveal = () => document.documentElement.classList.remove('i18n-wait')
    if (locale === 'th') {
      restore()
      reveal()
      return
    }
    translateTree(document.body)
    reveal()
    const observer = new MutationObserver(onMutations)
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTES })
    return () => observer.disconnect()
  }, [locale])

  return null
}
