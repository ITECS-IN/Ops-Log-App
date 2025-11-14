import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/i18n/translations";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  size?: "sm" | "default";
};

export function LanguageSwitcher({ className, size = "default" }: LanguageSwitcherProps) {
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe className={cn("text-muted-foreground", size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
      <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
        <SelectTrigger className={cn("w-32", size === "sm" && "h-8 text-sm")}>
          <SelectValue placeholder={t("language.selectLabel", "Language")} />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((option) => (
            <SelectItem key={option.code} value={option.code}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
