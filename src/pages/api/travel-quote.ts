import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { address } = await request.json() as { address?: string };
    if (!address || address.trim().length < 8 || address.length > 240) {
      return Response.json({ error: "Enter a complete pickup address." }, { status: 400 });
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const origin = process.env.MKG_ROUTE_ORIGIN;
    if (!apiKey || !origin) {
      return Response.json({ unavailable: true, message: "Travel will be calculated and confirmed by Sean." }, { status: 503 });
    }

    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.distanceMeters",
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: address.trim() },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE",
      }),
    });
    if (!response.ok) throw new Error(`Routes API returned ${response.status}`);
    const data = await response.json() as { routes?: Array<{ distanceMeters?: number }> };
    const oneWayMeters = data.routes?.[0]?.distanceMeters;
    if (!oneWayMeters) return Response.json({ error: "That route could not be calculated. Check the address." }, { status: 422 });

    // Two round trips: collection and return. Override if MKG groups routes differently.
    const routeMultiplier = Math.max(1, Number(process.env.MKG_ROUTE_MULTIPLIER || 4));
    const totalMiles = Math.ceil((oneWayMeters / 1609.344) * routeMultiplier);
    return Response.json({
      totalMiles,
      travelEstimate: totalMiles,
      display: `$${totalMiles}`,
      note: "Pickup-and-return travel estimate at $1 per total driven mile, rounded up. Sean confirms the route and any minimum before scheduling.",
    });
  } catch (error) {
    console.error("Travel quote error", error);
    return Response.json({ error: "Travel could not be calculated right now. Sean will confirm it with the service window." }, { status: 502 });
  }
};
