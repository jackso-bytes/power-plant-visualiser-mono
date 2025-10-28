import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Prisma } from '../../generated/prisma';

type PowerPlantSearchField = Prisma.PowerPlantScalarFieldEnum;
export type SearchSelectProps = {
  searchField: PowerPlantSearchField;
  title: string;
  // some kind of handler to set search state here
};

export const SearchSelect = ({ searchField, title }: SearchSelectProps) => {
  return (
    <Select>
      <SelectTrigger className='w-[180px]' aria-label={`Select a ${title}`}>
        <SelectValue placeholder={`Select a ${title}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SearchSelect;
