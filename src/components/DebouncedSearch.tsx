import { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Icon } from '@iconify-icon/react';

interface DebouncedSearchProps {
  /**
   * Callback function that is called when the search term changes after the debounce delay
   * @param searchTerm - The current search term
   */
  onSearch: (searchTerm: string) => void;
  
  /**
   * Time in milliseconds to wait after the user stops typing before triggering the search
   * @default 300
   */
  debounceTime?: number;
  
  /**
   * Placeholder text for the search input
   * @default 'Search...'
   */
  placeholder?: string;
  
  /**
   * Additional CSS class name for the search container
   */
  className?: string;
}

/**
 * A reusable debounced search input component
 */
const DebouncedSearch = ({
  onSearch,
  debounceTime = 300,
  placeholder = 'Search...',
  className = '',
}: DebouncedSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (isTyping) {
        onSearch(searchTerm);
        setIsTyping(false);
      }
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime, isTyping, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsTyping(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    setIsTyping(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon="lucide:search" className="text-gray-400" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                aria-label="clear search"
              >
                <Icon icon="lucide:x" className="text-gray-400" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '1px',
            },
          },
        }}
      />
      {isTyping && (
        <div className="text-xs text-gray-500 mt-1 ml-2">
          Typing...
        </div>
      )}
    </div>
  );
};

export default DebouncedSearch;
