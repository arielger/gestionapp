export const formatMoneyAmount = (number: number) => {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(number)
}
