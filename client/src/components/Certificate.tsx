import { BadgeIcon } from "@/components/ui/badge-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";
import html2canvas from "html2canvas";

interface CertificateProps {
  userName: string;
  completionDate: Date;
}

const Certificate = ({ userName, completionDate }: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `abacus-master-certificate-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="border-4 border-primary shadow-lg max-w-3xl mx-auto my-8">
      <div ref={certificateRef} className="p-6 bg-white">
        <CardHeader className="text-center border-b-2 border-gray-200 pb-6">
          <div className="flex justify-center mb-4">
            <BadgeIcon
              icon="emoji_events"
              variant="secondary"
              size="lg"
              className="text-amber-500 text-6xl"
            />
          </div>
          <div className="uppercase text-sm tracking-widest text-gray-500 mb-2">Certificate of Achievement</div>
          <CardTitle className="text-4xl font-bold text-primary">
            Abacus Master
          </CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <p className="text-gray-600 mb-8">This certificate is proudly presented to</p>
          <h2 className="text-3xl font-serif italic font-bold text-primary mb-4">{userName}</h2>
          <p className="text-gray-600 mb-8">for successfully completing all levels of the Abacus Master course</p>
          
          <div className="my-10 px-12 py-2 border-t border-b border-gray-200">
            <p className="text-gray-700">
              The bearer of this certificate has demonstrated exceptional skills
              in mental arithmetic, mastering all techniques of the abacus,
              and has completed all challenges with excellence.
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-10 px-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary mb-1">Abacus Master</div>
              <div className="text-sm text-gray-500">Official Program</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary mb-1">
                {formatDate(completionDate)}
              </div>
              <div className="text-sm text-gray-500">Completion Date</div>
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="bg-gray-50 p-4">
        <Button onClick={downloadCertificate} className="w-full">
          <span className="material-icons mr-2">download</span>
          Download Certificate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Certificate;