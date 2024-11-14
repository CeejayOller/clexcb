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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/components/layout/AuthProvider'
import { USER_ROLES } from '@/types/auth'

interface ComboboxInputProps {
  type: 'consignee' | 'exporter';
  value: string;
  onChangeAction: (value: string, entityId?: string, shouldCreate?: boolean) => Promise<void>;
  placeholder?: string;
  className?: string;
  initialEntities?: CustomEntity[];
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
  const [savedEntities, setSavedEntities] = React.useState<CustomEntity[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const [selectedEntity, setSelectedEntity] = React.useState<CustomEntity | null>(null)
  const { user } = useAuth()

    // Initialize with initialEntities if provided
    React.useEffect(() => {
      if (initialEntities && initialEntities.length > 0) {
        setSavedEntities(initialEntities)
      }
    }, [initialEntities])

    // Separate effect for fetching entities
    React.useEffect(() => {
      const fetchEntities = async () => {
        if (initialEntities && initialEntities.length > 0) return
  
        setIsLoading(true)
        try {
          const result = await getSavedEntitiesAction(type)
          setSavedEntities(Array.isArray(result) ? result : [])
        } catch (error) {
          console.error('Error fetching saved entities:', error)
          toast({
            title: 'Error',
            description: 'Failed to load saved entries',
            variant: 'destructive'
          })
          setSavedEntities([])
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchEntities()
    }, [type, toast, initialEntities])


  const hasPermissionToView = (entity: CustomEntity) => {
    if (!user) return false;
    const allowedRoles = [USER_ROLES.BROKER, USER_ROLES.SUPERADMIN] as const;
    return allowedRoles.includes(user.role as typeof allowedRoles[number]);
  };

  const filteredEntities = React.useMemo(() => {
    const entities = savedEntities || [];
    if (!searchTerm) {
      return entities.filter(entity => hasPermissionToView(entity));
    }
    
    return entities
      .filter(entity => hasPermissionToView(entity))
      .filter(entity => {
        const searchLower = searchTerm.toLowerCase();
        return (
          entity.name.toLowerCase().includes(searchLower) ||
          entity.address?.toLowerCase().includes(searchLower) ||
          (type === 'consignee' && entity.tin?.toLowerCase().includes(searchLower))
        );
      });
  }, [savedEntities, searchTerm, type, user]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setSelectedEntity(null)
    try {
      // Just update display value, don't create entity
      await onChangeAction(newValue, undefined, false)
    } catch (error) {
      console.error('Error updating value:', error)
      toast({
        title: 'Error',
        description: 'Failed to update value',
        variant: 'destructive'
      })
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      try {
        // Create new entity on Enter
        await onChangeAction(searchTerm, undefined, true)
        setOpen(false)
        setSearchTerm('')
      } catch (error) {
        console.error('Error creating new entity:', error)
        toast({
          title: 'Error',
          description: 'Failed to create new entity',
          variant: 'destructive'
        })
      }
    }
  }

  const handleSelect = async (entity: CustomEntity) => {
    if (!entity) return
    
    try {
      setSelectedEntity(entity)
      await onChangeAction(entity.name, entity.id, true)
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || `Select or enter new ${type}`}
            className={cn("w-full pr-10", className)}
            disabled={isLoading}
          />
          <ChevronDown 
            className={cn(
              "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform duration-200",
              open && "transform rotate-180"
            )}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="border-none focus:ring-0"
            disabled={isLoading}
          />
          <CommandEmpty>
            {isLoading ? (
              <div className="p-2 text-sm text-muted-foreground">Loading...</div>
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                No {type} found. Type to create new.
              </div>
            )}
          </CommandEmpty>
          {filteredEntities.length > 0 && (
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
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}