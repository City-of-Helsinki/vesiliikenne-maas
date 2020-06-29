export const formatPrice = (amount: string, currency: string): string => {
  return parseFloat(amount)
    .toLocaleString('fi-FI', { style: 'currency', currency: currency })
}