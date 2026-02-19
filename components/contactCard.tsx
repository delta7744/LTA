import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useLanguage } from "./language-provider";

export default function contactCard() {
  const { t } = useLanguage();
  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            {t.general.contact.title}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-lta-purple mr-3" />
              <span className="mr-3">{t.general.contact.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-lta-purple mr-3" />
              <span className="mr-3"> {t.general.contact.email}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-lta-purple mr-3 mt-0.5" />
              <span className="mr-3"> {t.general.contact.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
