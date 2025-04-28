"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  // react hook to get the current search params(query string).
  // query string: anything after the ? in the url.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // debounce the function to avoid too many re-renders(prevents server requests on every keystroke).
  // debounce: wait for 300ms after the user stops typing before calling the function.
  const handleSearch = useDebouncedCallback((term: string) => {
    // URLSearchParams is a built-in web API that provides utility methods to work with the query string of a URL.
    // like set, get, delete, etc.
    // It takes a string or an object as an argument and returns a URLSearchParams object.
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // replace the current URL with the new one.
    replace(`${pathname}?${params.toString()}`);
    console.log(params.toString());
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        id="search"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // defaultValue vs value:
        // we use defaultValue because we're not using react state to control the input.
        // we use value when we want to control the input with react state.
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
