// Tenant-related logic is currently not backed by a Prisma model.
// These functions are kept as stubs to allow the project to compile and run.

export async function activateTenant(tenantId: string) {
  console.warn("activateTenant is not implemented", { tenantId });
}

export async function createTenant(data: {
  name: string;
  email: string;
  document: string;
  phone: string;
}) {
  throw new Error("createTenant is not implemented");
}
