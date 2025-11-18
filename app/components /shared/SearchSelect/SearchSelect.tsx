import { AllCountriesResponse } from '@/app/types/responseTypes';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

export type SearchSelectProps = {
  title: string;
  options: AllCountriesResponse;
  setSearchState: (value: string) => void;
};

export const SearchSelect = ({
  title,
  options,
  setSearchState,
}: SearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-label={title}
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {value.length ? value : `${title}`}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder={`Search ${title} ...`} className='h-9' />
          <CommandList>
            <CommandEmpty>{`No ${title} found`}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setSearchState(currentValue);
                    setOpen(false);
                  }}
                >
                  {option}
                  <Check
                    className={
                      value === option ? 'ml-auto opacity-100' : 'ml-auto opacity-0'
                    }
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSelect;
