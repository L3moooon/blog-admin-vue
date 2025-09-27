import {
  LayoutDashboard,
  ChartLine,
  KeyRound,
  Cctv,
  Handshake,
  IdCard,
  NotebookText,
  Music4,
  Castle,
  Crosshair,
  Rocket,
  MessageSquareQuote,
  Database,
  Settings2,
  Settings,
  LaptopMinimalCheck,
  SquareUserRound,
} from "lucide-vue-next";
import type { LucideIcon } from "lucide-vue-next";

interface Icon {
  [key: string]: LucideIcon; // 键为string类型，值为number类型
}
export const iconComponentMap: Icon = {
  LayoutDashboard: LayoutDashboard,
  ChartLine: ChartLine,
  KeyRound: KeyRound,
  Cctv: Cctv,
  Handshake: Handshake,
  IdCard: IdCard,
  NotebookText: NotebookText,
  Music4: Music4,
  Castle: Castle,
  Crosshair: Crosshair,
  Rocket: Rocket,
  MessageSquareQuote: MessageSquareQuote,
  Database: Database,
  Settings2: Settings2,
  Settings: Settings,
  LaptopMinimalCheck: LaptopMinimalCheck,
  SquareUserRound: SquareUserRound,
};
