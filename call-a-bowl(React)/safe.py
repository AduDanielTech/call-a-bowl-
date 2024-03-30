

while True:
    print("Available currencies: USD, EUR, GBP, JPY")
    
    # Input from the user
    amount = float(input("Enter the amount: "))
    from_currency = input("From currency (e.g., USD, EUR): ").upper()
    to_currency = input("To currency (e.g., USD, EUR): ").upper()

    # Check if currencies are valid
    if from_currency not in exchange_rates or to_currency not in exchange_rates:
        print("Invalid currency code. Try again.")
        continue

    # Perform the conversion
    conversion_rate = exchange_rates[to_currency] / exchange_rates[from_currency]
    converted_amount = amount * conversion_rate

    # Display the result
    print(f"{amount} {from_currency} is equal to {converted_amount} {to_currency}")
    
    # Ask if the user wants to convert again
    another_conversion = input("Convert another amount? (yes/no): ").lower()
    if another_conversion != 'yes':
        break
