import { DependencyList, useLayoutEffect, MutableRefObject, useState, useEffect } from 'react'

interface UseAutoScrollOptions {
  deps?: DependencyList
  scrollable?: boolean
}

export function useAutoScroll<T extends HTMLElement | null>(
  ref: MutableRefObject<T>,
  { deps }: UseAutoScrollOptions,
) {
  useLayoutEffect(() => {
    if (ref && ref.current) {
      console.log(ref.current.scrollTop + 600, ref.current.scrollHeight)
      if (ref.current.scrollTop + 600 >= ref.current.scrollHeight) {
        ref.current.scrollTop = ref.current.scrollHeight
      }
    }
  }, [ref?.current, ref?.current?.scrollHeight, ...(deps ?? [])])
}
