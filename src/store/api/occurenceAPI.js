import { baseAPI } from "./baseAPI";
import countryData from "../../../data/countrydb.json";

const countryNameAliases = {
  "united states of america": "united states",
  "dem rep congo": "democratic republic of the congo",
  "eq guinea": "equatorial guinea",
  "north korea": "korea democratic peoples republic of",
  "south korea": "korea republic of",
  "s sudan": "south sudan",
  "w sahara": "western sahara",
  czechia: "czech republic",
};

function normalizeCountryName(name) {
  return name
    ?.toLowerCase()
    .trim() // Remove leading/trailing whitespace
    .normalize("NFD") // Helper to remove accents
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics -- this is important for names like "Côte d'Ivoire"
    .replace(/[^\w\s]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, " "); // Normalize whitespace
}

const baseUrl = "https://api.gbif.org/v1";

export const occurenceAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCountryObservations: builder.query({
      async queryFn({ selectedCountry }, _api, _opt, baseQuery) {
        try {
          console.log("Fetching observations for:", selectedCountry);

          // Country matching
          const normalizedCountry = normalizeCountryName(selectedCountry);

          const aliasedCountry =
            countryNameAliases[normalizedCountry] || normalizedCountry; // Apply alias if exists by checking the normalized country name against the alias mapping

          const countryCode = countryData.find((country) => {
            const dbCountry = normalizeCountryName(country.name);

            return (
              dbCountry === aliasedCountry ||
              dbCountry.includes(aliasedCountry) ||
              aliasedCountry.includes(dbCountry)
            );
          })?.code; // Here we assume the country data has a 'code' field for the country code
          const flag = countryData.find((country) => {
            const dbCountry = normalizeCountryName(country.name);
            return (
              dbCountry === aliasedCountry ||
              dbCountry.includes(aliasedCountry) ||
              aliasedCountry.includes(dbCountry)
            );
          })?.flag; // Optionally get the flag URL if needed for the UI

          console.log("Mapped country code:", countryCode, "Flag URL:", flag);
          const countryDisplay = {
            flag,
            name: selectedCountry,
          };

          if (!countryCode) {
            return {
              error: {
                status: 404,
                data: "Country not found",
              },
            };
          }
          // extinct
          //const extinctRes = await baseQuery(
          //  `v1/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=EX`,
          //);
          //console.log("Extinct category response:", extinctRes);
          //const extinctCount = extinctRes.data?.count || 0;

          //Exinct in the wild
          //  const extinctInWildRes = await baseQuery(
          //   `v1/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=EW`,
          //);
          // const extinctInWildCount = extinctInWildRes.data?.count || 0;
          //Regionally extinct
          // const regionallyExtinctRes = await baseQuery(
          //   `v1/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=RE`,
          // );
          //  const regionallyExtinctCount = regionallyExtinctRes.data?.count || 0;

          //Critically endangered
          const criticallyEndangeredRes = await baseQuery(
            `${baseUrl}/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=CR`,
          );
          const criticallyEndangeredCount =
            criticallyEndangeredRes.data?.count || 0;
          //Endangered
          const endangeredRes = await baseQuery(
            `${baseUrl}/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=EN`,
          );
          const endangeredCount = endangeredRes.data?.count || 0;
          //Vulnerable

          const vulnerableRes = await baseQuery(
            `${baseUrl}/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=VU`,
          );
          const vulnerableCount = vulnerableRes.data?.count || 0;
          //Near threatened
          // const nearThreatenedRes = await baseQuery(
          //    `${baseUrl}/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=NT`,
          //  );
          //  const nearThreatenedCount = nearThreatenedRes.data?.count || 0;
          //Least concern
          //  const leastConcernRes = await baseQuery(
          //    `${baseUrl}/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=LC`,
          //  );
          //  const leastConcernCount = leastConcernRes.data?.count || 0;
          //Data deficient
          //  const dataDeficientRes = await baseQuery(
          //   `${baseUrl}/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=DD`,
          // );
          //  const dataDeficientCount = dataDeficientRes.data?.count || 0;
          //Not evaluated
          // const notEvaluatedRes = await baseQuery(
          //    `${baseUrl}/occurrence/search?country=${countryCode}&taxonomicStatus=ACCEPTED&iucnRedListCategory=NE`,
          //   );
          //  const notEvaluatedCount = notEvaluatedRes.data?.count || 0;
          const observations = {
            //  extinct: extinctCount,
            // extinctInWild: extinctInWildCount,
            //  regionallyExtinct: regionallyExtinctCount,
            "Critically Endangered": criticallyEndangeredCount,
            Endangered: endangeredCount,
            Vulnerable: vulnerableCount,
            // Include the country name for display purposes
            //   "Near Threatened": nearThreatenedCount,
            //    "Least Concern": leastConcernCount,
            //   "Data Deficient": dataDeficientCount,
            //    "Not Evaluated": notEvaluatedCount,
          };
          console.log("Observations data:", observations);

          const responseData = {
            observations,
            countryDisplay,
          };
          console.log("Final response data for getObservations:", responseData);
          return { data: responseData };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error.message || "Unexpected error",
            },
          };
        }
      },
    }),
  }),
});

export const { useGetCountryObservationsQuery } = occurenceAPI;
