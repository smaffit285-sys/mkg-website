import { Redis } from "@upstash/redis";
import twilio from "twilio";

export type ServiceWindowRequest = {
  id: string;
  name: string;
  customerPhone: string;
  address?: string;
  handoff: "dropoff" | "pickup";
  requestedDay: string;
  dayPart: "morning" | "evening";
  requestSummary: string;
  travelEstimate?: string;
  status: "awaiting_sean" | "awaiting_customer" | "confirmed" | "declined";
  proposedWindow?: string;
  createdAt: string;
};

export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return "";
};

export function schedulingServices() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!redisUrl || !redisToken || !accountSid || !authToken || !from) return null;
  return {
    redis: new Redis({ url: redisUrl, token: redisToken }),
    sms: twilio(accountSid, authToken),
    from,
    authToken,
    ownerPhone: normalizePhone(process.env.MKG_OWNER_PHONE || "+13059095773"),
  };
}

export async function sendText(to: string, body: string) {
  const services = schedulingServices();
  if (!services) throw new Error("SMS scheduling is not configured");
  return services.sms.messages.create({ to, from: services.from, body });
}

export const requestKey = (id: string) => `mkg:service-window:${id}`;
export const customerKey = (phone: string) => `mkg:service-window:customer:${phone}`;

export function newRequestId() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
}
