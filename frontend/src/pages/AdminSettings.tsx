
import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useCompany } from "@/context/useCompany";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSettings() {
  useEffect(() => {
    document.title = "Admin Settings | Shift Log";
  }, []);

  const { company, loading: contextLoading, refresh } = useCompany();
  const { t } = useLanguage();
  const [companyName, setCompanyName] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shiftTimings, setShiftTimings] = useState([
    { name: "A", start: "", end: "" },
    { name: "B", start: "", end: "" },
    { name: "C", start: "", end: "" },
  ]);
  const [reportEmails, setReportEmails] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync state from context when company changes
  useEffect(() => {
    if (company) {
      setCompanyName(company.companyName || "");
      setCompanyLogoUrl(company.companyLogoUrl || company.logoUrl || "");
      // Always show 3 shifts, fill with backend data if present
      const defaultShifts = [
        { name: "A", start: "", end: "" },
        { name: "B", start: "", end: "" },
        { name: "C", start: "", end: "" },
      ];
      if (Array.isArray(company.shiftTimings)) {
        const shifts = [...defaultShifts];
        (company.shiftTimings as { name: string; start: string; end: string }[]).forEach((s: { name: string; start: string; end: string }, i: number) => {
          if (i < 3) shifts[i] = { ...shifts[i], ...s };
        });
        setShiftTimings(shifts);
      } else {
        setShiftTimings(defaultShifts);
      }
      setReportEmails(company.reportEmails || "");
    }
  }, [company]);

  useEffect(() => {
    setCameraSupported(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function"
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    let stream: MediaStream | null = null;
    const setupCamera = async () => {
      if (!cameraOpen) return;
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }
      setCameraLoading(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setCameraError(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to access camera.";
        setCameraError(message);
      } finally {
        setCameraLoading(false);
      }
    };
    if (cameraOpen) {
      setupCamera();
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraLoading(false);
      setCameraError(null);
    };
  }, [cameraOpen]);

  const handleShiftChange = (idx: number, field: 'name' | 'start' | 'end', value: string) => {
    setShiftTimings(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Only send non-empty shifts, max 3
      const filteredShifts = shiftTimings
        .map((s, i) => ({ ...s, name: s.name || String.fromCharCode(65 + i) }))
        .filter(s => s.start && s.end)
        .slice(0, 3);
      await api.put("/company", {
        companyName,
        shiftTimings: filteredShifts,
        reportEmails,
        companyLogoUrl,
      });
      toast.success(t('admin.settings.toast.saved', 'Settings saved'));
      refresh();
    } finally {
      setLoading(false);
    }
  };

  const uploadLogoFile = async (file: File) => {
    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", `company-logos/${file.name}`);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCompanyLogoUrl(res.data.url);
      toast.success(t('admin.settings.toast.logoUploaded', 'Logo uploaded'));
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogoFile(file);
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadLogoFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveLogo = () => {
    setCompanyLogoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCaptureFromCamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `company-logo-${Date.now()}.png`, {
            type: "image/png",
          });
          uploadLogoFile(file);
          setCameraOpen(false);
        }
      },
      "image/png",
      0.9
    );
  };

  return (
    <div className="py-4 md:py-8 mx-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('admin.settings.title', 'Settings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>{t('common.companyLogo', 'Company Logo')}</Label>
            <div
              className={`flex flex-col md:flex-row md:items-center gap-4 p-4 border-2 rounded-lg transition-all ${dragActive ? 'border-primary bg-primary/10' : 'border-dashed border-muted-foreground/30 bg-muted/30'}`}
              onDrop={handleLogoDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-2 min-w-20">
                {companyLogoUrl ? (
                  <img
                    src={companyLogoUrl}
                    alt="Company Logo"
                    className="h-20 w-20 object-contain border rounded bg-white shadow"
                  />
                ) : (
                  <div className="h-20 w-20 flex items-center justify-center border rounded bg-white text-xs text-muted-foreground">
                    {t('admin.settings.noLogo', 'No Logo')}
                  </div>
                )}
                {companyLogoUrl && (
                  <Button type="button" size="sm" variant="outline" onClick={handleRemoveLogo} disabled={logoUploading || loading} className="mt-1">
                    {t('common.remove', 'Remove')}
                  </Button>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  disabled={logoUploading || loading}
                  className="max-w-xs"
                />
                <div className="text-xs text-muted-foreground">
                  {t('common.dragDrop', 'Drag & drop an image here, or click to select a file. Recommended: square PNG/JPG, max 1MB.')}
                </div>
                {cameraSupported && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setCameraOpen(true)}
                    disabled={logoUploading || loading}
                    className="w-fit"
                  >
                    {t('common.captureWithCamera', 'Capture with Camera')}
                  </Button>
                )}
                {logoUploading && <span className="text-xs text-primary">{t('common.uploading', 'Uploading...')}</span>}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="companyName">{t('common.companyName', 'Company Name')}</Label>
            <Input
              id="companyName"
              type="text"
              placeholder={t('common.enterCompanyName', 'Enter company name')}
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              disabled={loading || contextLoading}
            />
          </div>
          <div className="mb-4">
            <Label>{t('common.shiftTimings', 'Shift Timings (24-hour, max 3, 8h each)')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shiftTimings.map((shift, idx) => (
                <div key={idx} className="flex flex-col gap-1 p-2 rounded bg-muted/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Input
                      type="text"
                      value={shift.name}
                      maxLength={1}
                      onChange={e => handleShiftChange(idx, 'name', e.target.value.toUpperCase())}
                      className="w-10 text-center font-bold"
                      placeholder={String.fromCharCode(65 + idx)}
                      disabled={loading || contextLoading}
                    />
                    <span className="text-xs text-muted-foreground">{t('common.shift', 'Shift')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={shift.start}
                      onChange={e => handleShiftChange(idx, 'start', e.target.value)}
                      className="w-24"
                      step="60"
                      disabled={loading || contextLoading}
                    />
                    <span className="text-xs">{t('common.to', 'to')}</span>
                    <Input
                      type="time"
                      value={shift.end}
                      onChange={e => handleShiftChange(idx, 'end', e.target.value)}
                      className="w-24"
                      step="60"
                      disabled={loading || contextLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="reportEmails">{t('common.reportEmailList', 'Report Email List')}</Label>
            <textarea
              id="reportEmails"
              className="border rounded px-2 py-1 w-full"
              rows={2}
              placeholder={t('admin.settings.reportPlaceholder', 'Comma separated emails')}
              value={reportEmails}
              onChange={e => setReportEmails(e.target.value)}
              disabled={loading || contextLoading}
            />
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || contextLoading}
            className="mt-2"
          >
            {loading || contextLoading ? t('common.saving', 'Saving...') : t('common.saveSettings', 'Save Settings')}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('admin.settings.cameraTitle', 'Capture Company Logo')}</DialogTitle>
            <DialogDescription>
              {t('admin.settings.cameraDescription', 'Use your device camera to capture a new photo for the company logo.')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square w-full bg-black/80 rounded-lg flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <p className="text-sm text-red-500 p-4 text-center">{cameraError}</p>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            {cameraLoading && (
              <p className="text-xs text-muted-foreground text-center">
                {t('common.initializingCamera', 'Initializing camera...')}
              </p>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCameraOpen(false)}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleCaptureFromCamera}
              disabled={!!cameraError || cameraLoading || logoUploading}
            >
              {t('common.captureAndUpload', 'Capture & Upload')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
