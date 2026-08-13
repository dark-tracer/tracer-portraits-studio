import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CopyMap } from "./site-copy";

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<CopyMap> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("site_content").select("key, value");
    const map: CopyMap = {};
    for (const row of data ?? []) map[row.key] = row.value ?? "";
    return map;
  },
);

const messageSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(4000),
});

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d) => messageSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject ?? "",
      message: data.message,
    });
    if (error) throw new Error("Could not send your message. Please try again.");
    return { ok: true };
  });
