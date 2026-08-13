import { useLoaderData } from "@tanstack/react-router";
import { makeCopy, type CopyMap } from "@/lib/site-copy";

/** Reads the admin-editable site text loaded once in the root route. */
export function useCopy() {
  const data = useLoaderData({ from: "__root__", structuralSharing: false }) as
    | { copy?: CopyMap }
    | undefined;
  return makeCopy(data?.copy);
}
