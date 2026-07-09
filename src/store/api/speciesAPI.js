import { baseAPI } from "./baseAPI";
import countryData from "../../../data/countrydb.json";

const baseUrl = "https://api.gbif.org/v1";

export const speciesAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getSpecies: builder.query({
      async queryFn({ speciesName }, _api, _opt, baseQuery) {
        //Here we use queryFn to perform multiple API calls in sequence. api and opt are not used in this case, but they are available if needed for more complex logic.
        const searchRes = await baseQuery(
          `${baseUrl}/species/search?q=${speciesName}&limit=1`,
        );
        const item = searchRes.data?.results?.[0];
        console.log("Search result for species:", item);
        if (!item) {
          return { error: { status: 404, data: "Species not found" } };
        }

        const iucnStatus = await baseQuery(
          `${baseUrl}/species/${item.key}/iucnRedListCategory`,
        );
        const iucnCode = iucnStatus.data?.code || "Not Evaluated";
        console.log("IUCN status for species:", iucnCode);

        // 3. Fetch all media associated with this taxon key
        const mediaRes = await baseQuery(
          `${baseUrl}/species/${item.key}/media`,
        );

        const mediaResults = mediaRes.data?.results || [];

        // 4. Transform: Filter for images and extract their URL identifiers
        const allImages = mediaResults
          .filter((mediaItem) => mediaItem.type === "StillImage")
          .map((mediaItem) => mediaItem.identifier)
          .filter((url) => !!url); // Remove any null/undefined URLs
        const species = {
          taxonKey: item.key ?? null,
          speciesKingdom: item.kingdom ?? null,
          speciesPhylum: item.phylum ?? null,
          speciesClass: item.class ?? null,
          speciesOrder: item.order ?? null,
          speciesFamily: item.family ?? null,
          speciesGenus: item.genus ?? null,
          speciesSpecies: item.species ?? null,
          iucnStatus: iucnCode,
          imageUrl: allImages.length > 0 ? allImages[0] : null,
        };
        console.log("Final species object to be returned:", species);
        return { data: species };
      },
      providesTags: ["Species"],
    }),

    getTaxonSpecies: builder.query({
      async queryFn({ dbSpeciesKey }, _api, _opt, baseQuery) {
        if (!dbSpeciesKey) {
          return { error: { status: 400, data: "Missing taxon key" } };
        }

        const response = await baseQuery(`${baseUrl}/species/${dbSpeciesKey}`);
        if (response.error) return { error: response.error };

        const item = response.data;
        console.log("Search result for speciesKey:", item);
        if (!item) {
          return { error: { status: 404, data: "Species not found" } };
        }

        const iucnStatus = await baseQuery(
          `${baseUrl}/species/${item.nubKey || dbSpeciesKey}/iucnRedListCategory`,
        );
        const iucnCode = iucnStatus.data?.code || "Not Evaluated";
        console.log("IUCN status for species:", iucnCode);

        // 3. Fetch all media associated with this taxon key
        const mediaRes = await baseQuery(
          `${baseUrl}/species/${item.nubKey || dbSpeciesKey}/media`,
        );

        const mediaResults = mediaRes.data?.results || [];

        // 4. Transform: Filter for images and extract their URL identifiers
        const allImages = mediaResults
          .filter((mediaItem) => mediaItem.type === "StillImage")
          .map((mediaItem) => mediaItem.identifier)
          .filter((url) => !!url); // Remove any null/undefined URLs
        const species = {
          taxonKey: item.nubKey ?? dbSpeciesKey ?? null,
          speciesKingdom: item.kingdom ?? null,
          speciesPhylum: item.phylum ?? null,
          speciesClass: item.class ?? null,
          speciesOrder: item.order ?? null,
          speciesFamily: item.family ?? null,
          speciesGenus: item.genus ?? null,
          speciesSpecies: item.species ?? null,
          iucnStatus: iucnCode,
          imageUrl: allImages.length > 0 ? allImages[0] : null,
        };
        console.log("Final species object to be returned:", species);
        return { data: species };
      },
      providesTags: ["Species"],
    }),

    getSpeciesObservations: builder.query({
      async queryFn({ taxonKey }, _api, _opt, baseQuery) {
        if (!taxonKey) {
          return { error: { status: 400, data: "Missing taxon key" } };
        }

        const response = await baseQuery(
          `${baseUrl}/occurrence/search?taxonKey=${taxonKey}&limit=10&basisOfRecord=LIVING_SPECIMEN&occurrenceStatus=PRESENT`,
        );

        if (response.error) return { error: response.error };

        const rawResults = Array.isArray(response.data?.results)
          ? response.data.results
          : [];

        const observations = rawResults.map((obs, index) => {
          // Get country name/code from the API
          const countryName = obs.country || "Unknown Country";

          // Check the flag in your local JSON
          console.log("Fetching flag for country:", countryName);

          const flagFind =
            countryData.find((country) => country.name === countryName)?.flag ||
            "🏳️";
          const flag = flagFind || "🏳️"; // Default to a white flag if not found

          return {
            id: obs.key ?? `${taxonKey}-${index}`,
            location: `${countryName}, ${obs.stateProvince || "Unknown State"}`,
            date: obs.eventDate
              ? new Date(obs.eventDate).toLocaleDateString()
              : "Unknown Date",
            flag: flag, // Adding the flag here
          };
        });

        return { data: observations };
      },
      providesTags: ["SpeciesObservations"],
    }),

    getDescription: builder.query({
      async queryFn({ taxonKey }, _api, _opt, baseQuery) {
        if (!taxonKey) {
          return { error: { status: 400, data: "Missing taxon key" } };
        }
        console.log("API-Fetching description for taxonKey:", taxonKey);
        const response = await baseQuery(
          `${baseUrl}/species/${taxonKey}/descriptions?limit=20`,
        );

        if (response.error) return { error: response.error };

        const rawResponse = response.data;
        const data = Array.isArray(rawResponse)
          ? rawResponse
          : rawResponse?.results || [];

        if (data.length === 0) {
          return { data: "No description available." };
        }

        const discussion = data.find(
          (d) => d.language === "eng" && d.type === "discussion",
        );

        if (discussion?.description) {
          return { data: discussion.description };
        }

        const english = data.find((d) => d.language === "eng");
        return {
          data:
            english?.description ||
            data[0]?.description ||
            "No description available.",
        };
      },
      providesTags: ["SpeciesDescriptions"],
    }),
  }),
});
export const {
  useGetSpeciesQuery,
  useLazyGetTaxonSpeciesQuery,
  useLazyGetSpeciesQuery,
  useLazyGetSpeciesObservationsQuery,
  useLazyGetDescriptionQuery,
} = speciesAPI;
