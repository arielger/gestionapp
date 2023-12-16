import { useQuery } from "@blitzjs/rpc"
import {
  Loader,
  Combobox,
  ComboboxItem,
  useCombobox,
  Group,
  Pill,
  CheckIcon,
  PillsInput,
  Input,
} from "@mantine/core"
import getRealStateOwners from "../queries/getRealStateOwners"
import { useThrottle } from "@react-hook/throttle"
import { personToSelectItem } from "../utils"
import { useState } from "react"

export const RealStateOwnerSelect = ({
  // Value used to initialize the labels for owners (when editing)
  initialValues,
  value,
  onChange,
  error,
}: {
  initialValues: ComboboxItem[]
  value: string[]
  onChange: (ids: string[]) => void
  error?: any
  // onFocus?: any
  // onBlur?: any
}) => {
  const [searchText, setSearchText] = useState("")
  const [searchTextDebounced, setSearchTextDebounced] = useThrottle("", 1)
  const updateSearchText = (value: string) => {
    setSearchText(value)
    setSearchTextDebounced(value)
  }

  const [owners, { isFetching }] = useQuery(
    getRealStateOwners,
    {
      fullNameSearch: searchTextDebounced,
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  /** Keep track of selected owners data (to add labels to the value prop) */
  const [ownersData, setOwnersData] = useState<ComboboxItem[]>(initialValues)
  const selectedOwnersComboBoxItems = value.map(
    (ownerId) => ownersData.find((owner) => owner.value === ownerId)!
  )

  const searchOwnersComboBoxItems = owners?.items?.map(personToSelectItem) || []

  const comboBoxOptions = [...selectedOwnersComboBoxItems, ...searchOwnersComboBoxItems]
    // remove duplicates
    .filter((owner, index, arr) => arr.findIndex((o) => o.value === owner.value) === index)
    ?.map((item) => {
      const isActive = value.some((ownerId) => ownerId === item.value)
      return (
        <Combobox.Option value={item.value} key={item.value} active={isActive}>
          <Group gap="sm">
            {isActive ? <CheckIcon size={12} /> : null}
            <span>{item.label}</span>
          </Group>
        </Combobox.Option>
      )
    })

  const handleValueRemove = (ownerIdToRemove: string) =>
    onChange(value.filter((id) => id !== ownerIdToRemove))

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  })

  const handleOptionSubmit = (selectedOwnerId: string) => {
    // toggle owner item selection
    const isAlreadySelected = value.some((ownerId) => selectedOwnerId === ownerId)

    if (!isAlreadySelected) {
      updateSearchText("")
    }

    const newValue = isAlreadySelected
      ? value.filter((ownerId) => ownerId !== selectedOwnerId)
      : [...value, selectedOwnerId]
    onChange(newValue)

    setOwnersData((owners) => {
      const comboBoxItem = searchOwnersComboBoxItems.find(
        (owner) => owner.value === selectedOwnerId
      )!
      return [...owners, comboBoxItem]
    })
  }

  return (
    <Input.Wrapper label="Propietario/s" error={error}>
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
        <Combobox.DropdownTarget>
          <PillsInput
            onClick={() => combobox.openDropdown()}
            rightSection={
              isFetching || (searchText !== searchTextDebounced && <Loader size={18} />)
            }
          >
            <Pill.Group>
              {selectedOwnersComboBoxItems.map((owner) => (
                <Pill
                  key={owner.value}
                  withRemoveButton
                  onRemove={() => handleValueRemove(owner.value)}
                >
                  {owner.label}
                </Pill>
              ))}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={searchText}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex()
                    updateSearchText(event.currentTarget.value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && searchText.length === 0) {
                      event.preventDefault()
                      value.length && handleValueRemove(value[value.length - 1]!)
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {comboBoxOptions}
            {owners?.items && owners?.items.length === 0 && (
              <Combobox.Empty>No se encontraron resultados</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  )
}
