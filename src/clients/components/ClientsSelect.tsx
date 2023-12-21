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
import getClients from "../queries/getClients"
import { useThrottle } from "@react-hook/throttle"
import { personToSelectItem } from "../utils"
import { useState } from "react"

export const ClientsSelect = ({
  // Values used to initialize the labels (value prop only includes ids)
  initialValues,
  value = [],
  onChange,
  error,
  label,
}: {
  initialValues: ComboboxItem[]
  value?: string[]
  onChange: (ids: string[]) => void
  error?: any
  label: string
  // onFocus?: any
  // onBlur?: any
}) => {
  const [searchText, setSearchText] = useState("")
  const [searchTextDebounced, setSearchTextDebounced] = useThrottle("", 1)
  const updateSearchText = (value: string) => {
    setSearchText(value)
    setSearchTextDebounced(value)
  }

  const [clients, { isFetching }] = useQuery(
    getClients,
    {
      fullNameSearch: searchTextDebounced,
    },
    {
      suspense: false,
      keepPreviousData: true,
    }
  )

  /** Keep track of selected clients data (to add labels to the value prop) */
  const [clientsData, setClientsData] = useState<ComboboxItem[]>(initialValues)
  const selectedClientsComboBoxItems = value.map(
    (clientId) => clientsData.find((client) => client.value === clientId)!
  )

  const searchClientsComboBoxItems = clients?.items?.map(personToSelectItem) || []

  const comboBoxOptions = [...selectedClientsComboBoxItems, ...searchClientsComboBoxItems]
    // remove duplicates
    .filter((client, index, arr) => arr.findIndex((o) => o.value === client.value) === index)
    ?.map((item) => {
      const isActive = value.some((clientId) => clientId === item.value)
      return (
        <Combobox.Option value={item.value} key={item.value} active={isActive}>
          <Group gap="sm">
            {isActive ? <CheckIcon size={12} /> : null}
            <span>{item.label}</span>
          </Group>
        </Combobox.Option>
      )
    })

  const handleValueRemove = (idToRemove: string) =>
    onChange(value.filter((id) => id !== idToRemove))

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  })

  const handleOptionSubmit = (selectedClientId: string) => {
    // toggle item selection
    const isAlreadySelected = value.some((clientId) => selectedClientId === clientId)

    if (!isAlreadySelected) {
      updateSearchText("")
    }

    const newValue = isAlreadySelected
      ? value.filter((clientId) => clientId !== selectedClientId)
      : [...value, selectedClientId]
    onChange(newValue)

    setClientsData((clients) => {
      const comboBoxItem = searchClientsComboBoxItems.find(
        (client) => client.value === selectedClientId
      )!
      return [...clients, comboBoxItem]
    })
  }

  return (
    <Input.Wrapper label={label} error={error}>
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
        <Combobox.DropdownTarget>
          <PillsInput
            onClick={() => combobox.openDropdown()}
            rightSection={
              isFetching || (searchText !== searchTextDebounced && <Loader size={18} />)
            }
          >
            <Pill.Group>
              {selectedClientsComboBoxItems.map((client) => (
                <Pill
                  key={client.value}
                  withRemoveButton
                  onRemove={() => handleValueRemove(client.value)}
                >
                  {client.label}
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
            {clients?.items && clients?.items.length === 0 && (
              <Combobox.Empty>No se encontraron resultados</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  )
}
