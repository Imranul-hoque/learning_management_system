"use client";
import qs from 'query-string';
import { Search } from 'lucide-react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useDebounced } from '@/hooks/use-debounce-hook';
import { useEffect, useState } from 'react';


const SearchInput = () => {

    const [value, setValue] = useState("");
    const debouncedValue = useDebounced(value);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title : debouncedValue
            }
        }, { skipNull : true, skipEmptyString : true })
        router.push(url)
    }, [currentCategoryId,debouncedValue,pathname, router])

    return (
      <div className="relative">
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
        <Input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
          placeholder="Search for a course"
        />
      </div>
    );
}
 
export default SearchInput;