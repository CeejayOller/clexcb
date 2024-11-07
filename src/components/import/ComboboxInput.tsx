// src/components/import/ComboboxInput.tsx
'use client'

import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import type { CustomEntity } from '@/types/import'
import { getSavedEntitiesAction } from '@/app/actions/import'
import { useToast } from '@/components/ui/use-toast'

interface ComboboxInputProps {
  type: 'consignee' | 'exporter';
  value: string;
  onChangeAction: (value: string, entityId?: string) => Promise<void>;
  placeholder?: string;
  className?: string;
  initialEntities?: CustomEntity[]; // Optional prop for initial entities
}

export function ComboboxInput({
  type,
  value = '',
  onChangeAction,
  placeholder,
  className,
  initialEntities = []
}: ComboboxInputProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [savedEntities, setSavedEntities] = React.useState<CustomEntity[]>(initialEntities)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const [selectedEntity, setSelectedEntity] = React.useState<CustomEntity | null>(null)

  // Fetch saved entities on mount
  React.useEffect(() => {
    const fetchEntities = async () => {
      if (initialEntities.length > 0) {
        setSavedEntities(initialEntities)
        return
      }

      setIsLoading(true)
      try {
        const entities = await getSavedEntitiesAction(type)
        setSavedEntities(entities)
      } catch (error) {
        console.error('Error fetching saved entities:', error)
        toast({
          title: 'Error',
          description: 'Failed to load saved entries',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntities()
  }, [type, toast, initialEntities])

  // Filter entities based on search term
  const filteredEntities = React.useMemo(() => {
    return savedEntities.filter(entity => {
      if (!searchTerm) return true
      return (
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type === 'consignee' && entity.tin?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
  }, [savedEntities, searchTerm, type])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setSelectedEntity(null) // Clear selected entity when typing
    try {
      await onChangeAction(newValue)
    } catch (error) {
      console.error('Error updating value:', error)
      toast({
        title: 'Error',
        description: 'Failed to update value',
        variant: 'destructive'
      })
    }
  }

  const handleSelect = async (selectedEntity: CustomEntity) => {
    try {
      setSelectedEntity(selectedEntity)
      await onChangeAction(selectedEntity.name, selectedEntity.id)
      setOpen(false)
      setSearchTerm('')
    } catch (error) {
      console.error('Error selecting entity:', error)
      toast({
        title: 'Error',
        description: 'Failed to select entry',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || `Select or enter new ${type}`}
          className="w-full pr-10"
          disabled={isLoading}
        />
        <ChevronDown 
          className={cn(
            "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform duration-200",
            open && "transform rotate-180"
          )}
          onClick={() => setOpen(!open)}
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md">
          <Command className="w-full">
            <CommandInput
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-none focus:ring-0"
              disabled={isLoading}
            />
            <CommandEmpty>
              {isLoading ? 'Loading...' : (
                <div className="p-2 text-sm text-muted-foreground">
                  No {type} found. Type to create new.
                </div>
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {filteredEntities.map((entity) => (
                <CommandItem
                  key={entity.id}
                  value={entity.name}
                  onSelect={() => handleSelect(entity)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedEntity?.id === entity.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{entity.name}</span>
                    {entity.address && (
                      <span className="text-sm text-muted-foreground truncate">
                        {entity.address}
                      </span>
                    )}
                    {type === 'consignee' && entity.tin && (
                      <span className="text-xs text-muted-foreground">
                        TIN: {entity.tin}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
}