const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const FALLBACK_PLACE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

const FALLBACK_DESTINATION =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80";

export const getPlaceImage = async (placeName) => {
  try {
    if (!placeName || !UNSPLASH_ACCESS_KEY) {
      return FALLBACK_PLACE;
    }

    const enhancedQuery = `${placeName} travel tourism landmark landscape`;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        enhancedQuery
      )}&per_page=5&orientation=landscape&content_filter=high&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    const data = await response.json();

    if (data?.results?.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      return data.results[randomIndex].urls.regular;
    }

    return FALLBACK_PLACE;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return FALLBACK_PLACE;
  }
};

export const getDestinationImage = async (destination) => {
  try {
    if (!destination || !UNSPLASH_ACCESS_KEY) {
      return FALLBACK_DESTINATION;
    }

    const enhancedQuery = `${destination} city skyline travel`;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        enhancedQuery
      )}&per_page=5&orientation=landscape&content_filter=high&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    const data = await response.json();

    if (data?.results?.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      return data.results[randomIndex].urls.regular;
    }

    return FALLBACK_DESTINATION;
  } catch (error) {
    console.error("Error fetching destination image from Unsplash:", error);
    return FALLBACK_DESTINATION;
  }
};