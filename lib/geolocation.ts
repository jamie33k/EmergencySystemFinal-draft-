export async function getCurrentLocation(): Promise<{ lat: number; lng: number; city: string } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Use a free geocoding service (no API key required)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                "User-Agent": "HudumaEmergencyConnect/1.0",
              },
            },
          )
          const data = await response.json()

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            "Unknown Location"

          resolve({ lat: latitude, lng: longitude, city })
        } catch (error) {
          // Fallback to coordinates only
          resolve({ lat: latitude, lng: longitude, city: "Unknown Location" })
        }
      },
      () => {
        resolve(null)
      },
      { timeout: 10000 },
    )
  })
}
