import { useDebounced } from '@/hooks/useDebounce'
import { Icon } from '@iconify-icon/react'
import { useState, useEffect } from 'react'
import { ButtonHTMLAttributes } from 'react'

type ClearButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

type SearchBoxProps = {
  onSearch: (q: string) => void | Promise<void>
  placeholder?: string
  delay?: number
  minLength?: number
  className?: string
}

export const ClearButton = ({ className = '', ...props }: ClearButtonProps) => {
  return (
    <button
      className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      aria-label='Clear search'
      {...props}
    >
      <svg
        className='w-4 h-4 text-gray-600 dark:text-gray-300'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 8.586l3.536-3.536a1 1 0 111.414 1.414L11.414 10l3.536 3.536a1 1 0 01-1.414 1.414L10 11.414l-3.536 3.536a1 1 0 01-1.414-1.414L8.586 10 5.05 6.464A1 1 0 016.464 5.05L10 8.586z'
          clipRule='evenodd'
        />
      </svg>
    </button>
  )
}

const Spinner = () => <svg
className='animate-spin w-4 h-4 text-gray-500'
xmlns='http://www.w3.org/2000/svg'
fill='none'
viewBox='0 0 24 24'
>
<circle
  className='opacity-25'
  cx='12'
  cy='12'
  r='10'
  stroke='currentColor'
  strokeWidth='4'
></circle>
<path
  className='opacity-75'
  fill='currentColor'
  d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
></path>
</svg>

// Tailwind-styled debounced search component
export const SearchBox = ({
  onSearch,
  placeholder = 'Search...',
  delay = 400,
  minLength = 1,
  className = ''
}: SearchBoxProps) => {
  const [query, setQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const debouncedQuery = useDebounced(query, delay)

  // show loading when user is typing and waiting for debounce
  useEffect(() => {
    if (query === '') {
      setIsTyping(false)
      // still notify about empty query if needed
      onSearch('')
      return
    }
    // if user is actively typing, show loading until debounced value arrives
    setIsTyping(true)
  }, [query, onSearch])

  // call onSearch when debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery.length < minLength && debouncedQuery !== '') return
    setIsTyping(false)
    onSearch(debouncedQuery)
  }, [debouncedQuery, minLength, onSearch])

  const clear = () => setQuery('')

  return (
    <div className={`w-full max-w-xl ${className}`}>
      <label className='relative block'>
        <span className='sr-only'>Search</span>
        <div className='flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400'>

          <Icon icon='ic:sharp-search' width={18} height={18} />

          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className='ml-3 w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400'
            aria-label='Search input'
          />

          <div className='ml-2 w-5 h-5 flex items-center justify-center'>
            {isTyping && <Spinner />}
          </div>

          {query && <ClearButton onClick={clear} className='ml-2' />}
        </div>
      </label>
    </div>
  )
}
