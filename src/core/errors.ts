import SuperJson from "superjson"

// Reference
// https://blitzjs.com/docs/error-handling#custom-errors

/*
    Used to when item can't be deleted because of related entities existing
    P2003 - "Foreign key constraint failed on the field: {field_name}"
*/
export class RelatedExistingEntitiesError extends Error {
  name = "RelatedExistingEntitiesError"
}

// Register with SuperJson serializer so it's reconstructed on the client
SuperJson.registerClass(RelatedExistingEntitiesError)
