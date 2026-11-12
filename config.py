import os

# Telegram credentials must be configured as environment variables.
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

# Do'kon ma'lumotlari
STORE_NAME = os.environ.get("STORE_NAME", "Melfis_flow3rs_samarqand")
STORE_PHONE = os.environ.get("STORE_PHONE", "+998 90 123 45 67")
STORE_INSTAGRAM = os.environ.get("STORE_INSTAGRAM", "https://www.instagram.com/samarqand.melfisflowers/")
STORE_ADDRESS = os.environ.get("STORE_ADDRESS", "Samarqand shahri, Dagbitskaya ko'chasi")
STORE_WORKING_HOURS = os.environ.get("STORE_WORKING_HOURS", "08:00 - 23:00 (Har kuni dam olishsiz)")

# Yetkazib berish narxlari (so'mda)
DELIVERY_COST_CITY = int(os.environ.get("DELIVERY_COST_CITY", 25000))
DELIVERY_FREE_FROM = int(os.environ.get("DELIVERY_FREE_FROM", 500000))
