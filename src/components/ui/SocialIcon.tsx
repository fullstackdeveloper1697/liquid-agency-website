import type { IconType } from "react-icons";
import {
  FaBluesky,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { SocialKey } from "@/config/site";

const icons: Record<SocialKey, IconType> = {
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  x: FaXTwitter,
  bluesky: FaBluesky,
  threads: FaThreads,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  twitch: FaTwitch,
  whatsapp: FaWhatsapp,
};

export function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  const Icon = icons[name];
  return <Icon aria-hidden className={className} />;
}
