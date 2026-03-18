export async function createSubscription(data: {
  tenantId: string;
  planId: string;
}) {
  // Subscriptions are not currently persisted in the database.
  // This is a stub to allow the project to compile and run.
  return {
    id: `sub_${Date.now()}`,
    tenantId: data.tenantId,
    planId: data.planId,
    status: "ACTIVE",
    createdAt: new Date(),
  };
}
