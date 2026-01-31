import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constants";
import { 
  Select,         // The main select component (wraps the whole thing)
  SelectContent,  // The dropdown menu content
  SelectItem,     // Each selectable option
  SelectTrigger,  // The clickable element that opens the dropdown
  SelectValue     // Displays the currently selected value
} from "@/components/ui/select";

const categories = ['Distance Driver', 'Fairway Driver', 'Midrange', 'Putter'];

export default async function Search(){
    return (
        <form action='/search' method="GET" className="flex items-stretch h-9">
            <Select name="category">
                <SelectTrigger className="w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r  rounded-r-none rounded-l-md rtl:rounded-r-md rtl:rounded-l-none">
                    <SelectValue placeholder='All Products'></SelectValue>
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectItem value="all">All Products</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
            className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
            placeholder={`Search Products: ${APP_NAME}`}
            name="q"
            type="search"
            />
            <button
            type="submit"
            className="bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-3 py-2"
            >
                <SearchIcon className="w-6 h-6"></SearchIcon>
            </button>
        </form>
    )
}