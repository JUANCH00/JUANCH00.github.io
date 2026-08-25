import { useEffect, useState } from 'react'

const formatterFor = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

/**
 * The current time in a given IANA zone, ticking once a second.
 *
 * Uses `Intl` rather than a hand-rolled UTC offset so the clock stays correct
 * across DST changes and wherever the visitor happens to be.
 */
export const useLocalTime = (timeZone: string): string => {
  const [time, setTime] = useState('--:--:--')

  useEffect(() => {
    const formatter = formatterFor(timeZone)
    const tick = () => setTime(formatter.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timeZone])

  return time
}
