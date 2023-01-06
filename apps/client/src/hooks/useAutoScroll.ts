import { DependencyList, useLayoutEffect, MutableRefObject } from 'react'

interface UseAutoScrollOptions {
  deps?: DependencyList
  offset?: number
}

interface UseAutoScrollReturn {
  scrollToBottom: () => void
}

export function useAutoScroll<T extends HTMLElement | null>(
  ref: MutableRefObject<T>,
  { deps, offset }: UseAutoScrollOptions,
): UseAutoScrollReturn {
  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }

  useLayoutEffect(() => {
    if (ref && ref.current) {
      if (!offset) {
        scrollToBottom()
        return
      }

      if (ref.current.scrollTop + offset >= ref.current.scrollHeight) {
        scrollToBottom()
      }
    }
  }, [ref?.current, ref?.current?.scrollHeight, offset, ...(deps ?? [])])

  return { scrollToBottom }
}
