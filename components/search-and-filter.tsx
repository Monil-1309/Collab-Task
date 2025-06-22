"use client"

import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: {
    status: string
    priority: string
    assignee: string
    type: string
  }
  onFiltersChange: (filters: any) => void
}

export function SearchAndFilter({ searchQuery, onSearchChange, filters, onFiltersChange }: SearchAndFilterProps) {
  const debouncedSearch = useDebounce(searchQuery, 300)

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "on-hold", label: "On Hold" },
    { value: "done", label: "Done" },
    { value: "deployed", label: "Deployed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ]

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "improvement", label: "Improvement" },
  ]

  const assigneeOptions = [
    { value: "", label: "All Assignees" },
    { value: "john@example.com", label: "John Doe" },
    { value: "jane@example.com", label: "Jane Smith" },
  ]

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const clearAllFilters = () => {
    onFiltersChange({
      status: "",
      priority: "",
      assignee: "",
      type: "",
    })
    onSearchChange("")
  }

  const hasActiveFilters = searchQuery || activeFiltersCount > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks by title, assignee, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto p-0 text-xs">
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <Select
                      value={filters.priority}
                      onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Assignee</label>
                    <Select
                      value={filters.assignee}
                      onValueChange={(value) => onFiltersChange({ ...filters, assignee: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assigneeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9 px-2">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange("")} />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusOptions.find((o) => o.value === filters.status)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ ...filters, status: "" })} />
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary" className="gap-1">
              Priority: {priorityOptions.find((o) => o.value === filters.priority)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ ...filters, priority: "" })} />
            </Badge>
          )}
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Type: {typeOptions.find((o) => o.value === filters.type)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ ...filters, type: "" })} />
            </Badge>
          )}
          {filters.assignee && (
            <Badge variant="secondary" className="gap-1">
              Assignee: {assigneeOptions.find((o) => o.value === filters.assignee)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ ...filters, assignee: "" })} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
