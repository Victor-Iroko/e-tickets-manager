/**
 * GET /api/events/:id/analytics - Event sales & attendance statistics
 */
export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, "id");
  return {
    eventId,
    totalTicketsSold: 25,
    totalRevenue: "1250.00",
    ticketsScanned: 18,
    ticketsByType: [
      { name: "Regular Pass", sold: 25, remaining: 475, revenue: "1250.00" },
      { name: "VIP Pass", sold: 0, remaining: 100, revenue: "0.00" },
    ],
    salesOverTime: [
      { date: new Date().toISOString().split("T")[0], count: 25, revenue: "1250.00" },
    ],
  };
});
