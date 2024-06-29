import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// Initialize the bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

const dates = ["06/28/2024", "06/29/2024"];

const baseUrl =
  "https://api.bookings.clubspeed.com/FGCS/FGLondon/products/prime-time-games-booking,-fri-%E2%80%93-sun-(18+)/timeslots";
const bookingUrl =
  "https://bookings.clubspeed.com/FGCS/FGLondon/products/prime-time-games-booking,-fri-%E2%80%93-sun-(18+)?numberOfGuests=2&date=";

async function checkAvailability() {
  for (const date of dates) {
    const url = `${baseUrl}?date=${encodeURIComponent(date)}&numberOfGuests=2`;
    try {
      const response = await axios.get(url);
      const data = response.data.data;

      const availableSlots = data.filter((slot: any) => {
        const time = new Date(slot.scheduledTime);
        const hours = time.getUTCHours();
        return slot.timeSlotStatus === true && hours >= 13 && hours <= 20;
      });

      if (availableSlots.length > 0) {
        availableSlots.forEach((slot: any) => {
          const time = new Date(slot.scheduledTime);
          const bookingLink = `${bookingUrl}${encodeURIComponent(date)}`;
          bot.sendMessage(
            TELEGRAM_CHAT_ID,
            `Time slot available on ${date}: ${time.toLocaleTimeString(
              "en-GB",
              { timeZone: "UTC" }
            )}\nBook here: ${bookingLink}`
          );
        });
      } else {
        console.log(`[${new Date()}]`, `No time slots available for ${date}.`);
      }
    } catch (error) {
      console.error(`Error fetching time slots for ${date}:`, error);
    }
  }
}

// Notify when the script starts running
bot.sendMessage(
  TELEGRAM_CHAT_ID,
  "Program started. Checking for available time slots every 30 seconds."
);

setInterval(checkAvailability, 30000);

console.log(
  "Program started. Checking for available time slots every 30 seconds."
);
