export async function getUserById(
  entityManager: any,
  user_id: string,
): Promise<any | null> {
  const result = await entityManager.query(
    `SELECT * FROM "user" WHERE "id" = $1 LIMIT 1`,
    [user_id],
  );
  return result.length > 0 ? result[0] : null;
}
