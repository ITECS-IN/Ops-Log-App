
import { useState, useEffect, useRef } from "react";
import {
  Dialog as PreviewDialog,
  DialogContent as PreviewDialogContent,
} from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dialog as CameraDialog,
  DialogContent as CameraDialogContent,
  DialogHeader as CameraDialogHeader,
  DialogTitle as CameraDialogTitle,
  DialogDescription as CameraDialogDescription,
  DialogFooter as CameraDialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCompany } from "@/context/useCompany";
import { useLanguage } from "@/context/LanguageContext";

interface Line {
  _id: string;
  lineName: string;
}

interface Machine {
  _id: string;
  machineName: string;
  lineId: string | { _id: string; lineName: string };
}

interface CompanyUser {
  uid: string;
  email: string;
  role: string;
  employeeCode?: string | null;
  disabled?: boolean;
}

interface AddLogForm {
  lineId: string;
  machineId: string;
  userId: string;
  shift: string;
  noteType: string;
  severity: number;
  description: string;
  downtimeStart: string;
  downtimeEnd: string;
  photo: File | null;
  fileUrl?: string;
  dateTime: string;
  duration: number;
  status: string;
}

type AddLogModalProps = {
  lines?: Line[];
  machines?: Machine[];
  onSubmit: (data: AddLogForm) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  editLog?: Partial<AddLogForm & { _id: string }>;
  isEdit?: boolean;
};

export function AddLogModal({
  lines,
  machines,
  onSubmit,
  open,
  setOpen,
  editLog,
  isEdit = false,
}: AddLogModalProps) {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const { company } = useCompany();
  const { t } = useLanguage();
  const [form, setForm] = useState<AddLogForm>({
    lineId: "",
    machineId: "",
    userId: "",
    shift: "A",
    noteType: "Observation",
    severity: 1,
    description: "",
    downtimeStart: "",
    downtimeEnd: "",
    photo: null,
    dateTime: new Date().toISOString(),
    duration: 0,
    status: "Open",
  });
  useEffect(() => {
    if (open) {
      api.get("/auth/company-users").then(res => {
        const activeUsers: CompanyUser[] = Array.isArray(res.data)
          ? res.data.filter((u: CompanyUser) => u.role === "user" && !u.disabled)
          : [];
        setUsers(activeUsers);
      });
    }
  }, [open]);

  // Sync form state with editLog when opening in edit mode
  useEffect(() => {
    if (isEdit && editLog && open) {
      // Helper to convert ISO to local datetime-local string
      const toLocalInput = (iso?: string) =>
        iso ? new Date(iso).toISOString().slice(0, 16) : "";
      setForm({
        lineId: (typeof editLog.lineId === "object" && editLog.lineId !== null ? (editLog.lineId as { _id: string })._id : editLog.lineId) || "",
        machineId: (typeof editLog.machineId === "object" && editLog.machineId !== null ? (editLog.machineId as { _id: string })._id : editLog.machineId) || "",
        userId:
          (typeof editLog.userId === "object" && editLog.userId !== null
            ? (editLog.userId as { _id: string })._id
            : editLog.userId) || "",
        shift: editLog.shift || "A",
        noteType: editLog.noteType || "Observation",
        severity: editLog.severity || 1,
        description: editLog.description || "",
        downtimeStart: toLocalInput(editLog.downtimeStart),
        downtimeEnd: toLocalInput(editLog.downtimeEnd),
        photo: null,
        dateTime: editLog.dateTime || new Date().toISOString(),
        duration: editLog.duration || 0,
        status: editLog.status || "Open",
        fileUrl: editLog.fileUrl || "",
      });
      // Show preview for previously uploaded file
      if (editLog.fileUrl) {
        if (editLog.fileUrl.endsWith('.jpg') || editLog.fileUrl.endsWith('.jpeg') || editLog.fileUrl.endsWith('.png')) {
          setFilePreview(editLog.fileUrl);
        } else if (editLog.fileUrl.endsWith('.mp4') || editLog.fileUrl.endsWith('.webm')) {
          setFilePreview(""); // handled by video preview below
        } else {
          setFilePreview("");
        }
      } else {
        setFilePreview("");
      }
    } else if (!open) {
      setForm({
        lineId: "",
        machineId: "",
        userId: "",
        shift: "A",
        noteType: "Observation",
        severity: 1,
        description: "",
        downtimeStart: "",
        downtimeEnd: "",
        photo: null,
        dateTime: new Date().toISOString(),
        duration: 0,
        status: "Open",
        fileUrl: "",
      });
      setFilePreview("");
    }
  }, [isEdit, editLog, open]);

  const handleChange = <K extends keyof AddLogForm>(field: K, value: AddLogForm[K]) =>
    setForm(f => ({ ...f, [field]: value }));

  // const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) handleChange("photo", e.target.files[0]);
  // };

  const [fileUploading, setFileUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<"photo" | "video">("photo");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingStopActionRef = useRef<"save" | "discard">("save");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleChange("photo", file);
    handleChange("fileUrl", "");
    setFilePreview("");
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else if (file.type.startsWith("video/")) {
      setFilePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    setCameraSupported(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function",
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    const setupCamera = async () => {
      if (!cameraOpen) return;
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError(
          t(
            "addLog.media.cameraUnsupported",
            "Camera is not supported in this browser.",
          ),
        );
        return;
      }
      setCameraLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: cameraMode === "video",
        });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setCameraError(null);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : t("addLog.media.cameraUnavailable", "Unable to access camera.");
        setCameraError(message);
      } finally {
        setCameraLoading(false);
      }
    };

    if (cameraOpen) {
      setupCamera();
    } else {
      setIsRecording(false);
      recordedChunksRef.current = [];
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.ondataavailable = null;
        mediaRecorderRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      mounted = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [cameraOpen, cameraMode, t]);

  const handleCapturedMedia = (file: File, previewUrl: string) => {
    handleChange("photo", file);
    handleChange("fileUrl", "");
    setFilePreview(previewUrl);
    setCameraOpen(false);
    setIsRecording(false);
    recordedChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  const handleCapturePhoto = () => {
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
        if (!blob) return;
        const file = new File([blob], `log-photo-${Date.now()}.png`, {
          type: "image/png",
        });
        const previewUrl = URL.createObjectURL(blob);
        handleCapturedMedia(file, previewUrl);
      },
      "image/png",
      0.92,
    );
  };

  const startRecording = () => {
    if (!mediaStreamRef.current || isRecording) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStreamRef.current, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    recorder.onstop = () => {
      const shouldSave = recordingStopActionRef.current === "save";
      setIsRecording(false);
      if (shouldSave && recordedChunksRef.current.length) {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const file = new File([blob], `log-video-${Date.now()}.webm`, {
          type: "video/webm",
        });
        const previewUrl = URL.createObjectURL(blob);
        handleCapturedMedia(file, previewUrl);
      } else {
        recordedChunksRef.current = [];
      }
      recordingStopActionRef.current = "save";
    };
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = (save = true) => {
    if (!isRecording || !mediaRecorderRef.current) return;
    recordingStopActionRef.current = save ? "save" : "discard";
    mediaRecorderRef.current.stop();
  };

  const handleCameraOpenChange = (value: boolean) => {
    if (!value && isRecording) {
      stopRecording(false);
    }
    setCameraOpen(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId) {
      toast.error(t('addLog.validation.userRequired', 'Please select a user'));
      return;
    }
    let duration = 0;
    if (form.downtimeStart && form.downtimeEnd) {
      const start = new Date(form.downtimeStart).getTime();
      const end = new Date(form.downtimeEnd).getTime();
      duration = Math.max(0, Math.round((end - start) / 60000));
    }
    let fileUrl = form.fileUrl;
    if (form.photo) {
      setFileUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", form.photo);
        formData.append("path", `records/media/${Date.now()}_${form.photo.name}`);
        const res = await api.post("/records/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fileUrl = res.data.url;
        handleChange("fileUrl", fileUrl);
        toast.success(t('addLog.toast.fileUploaded', 'File uploaded'));
      } finally {
        setFileUploading(false);
      }
    }
    const payload: Partial<AddLogForm> = {
      lineId: form.lineId,
      machineId: form.machineId,
      userId: form.userId,
      shift: form.shift,
      noteType: form.noteType,
      severity: form.severity,
      description: form.description,
      downtimeStart: form.downtimeStart || undefined,
      downtimeEnd: form.downtimeEnd || undefined,
      duration,
      status: form.status,
      fileUrl,
    };
    if (isEdit && editLog && editLog._id) {
      await api.put(`/records/${editLog._id}`, payload);
    } else {
      await api.post("/records", payload);
    }
    toast.success(isEdit ? t('addLog.toast.updated', 'Log updated') : t('addLog.toast.created', 'Log created'));
    onSubmit(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl w-full p-4 rounded-lg shadow-lg bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-2">
            {isEdit ? t('addLog.modal.editTitle', 'Edit Log') : t('addLog.modal.addTitle', 'Add Log')}
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.dateTime', 'Date/Time')}</Label>
              <Input
                disabled
                type="datetime-local"
                value={form.dateTime.slice(0, 16)}
                onChange={e => handleChange("dateTime", new Date(e.target.value).toISOString())}
                required
                className="h-9 text-sm bg-gray-50 border-gray-300 rounded"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.operator', 'User')}</Label>
              <Select value={form.userId} onValueChange={v => handleChange("userId", v)} disabled={isEdit}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder={t('addLog.placeholders.operator', 'Select user')} />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.uid} value={user.uid} className="text-sm">
                      {user.employeeCode ? `${user.employeeCode} – ${user.email}` : user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.line', 'Line')}</Label>
              <Select value={form.lineId} onValueChange={v => handleChange("lineId", v)} disabled={isEdit}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('addLog.placeholders.line', 'Select line')} /></SelectTrigger>
                <SelectContent>
                  {Array.isArray(lines) ? lines.map(line => <SelectItem key={line._id} value={line._id} className="text-sm">{line.lineName}</SelectItem>) : null}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.machine', 'Machine')}</Label>
              <Select value={form.machineId} onValueChange={v => handleChange("machineId", v)} disabled={isEdit}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('addLog.placeholders.machine', 'Select machine')} /></SelectTrigger>
                <SelectContent>
                  {Array.isArray(machines)
                    ? machines
                        .filter(m =>
                            form.lineId && (typeof m.lineId === 'string' ? m.lineId === form.lineId : m.lineId?._id === form.lineId)
                        )
                        .map(m => (
                          <SelectItem key={m._id} value={m._id} className="text-sm">
                            {m.machineName}
                          </SelectItem>
                        ))
                    : null}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.shift', 'Shift')}</Label>
              <Select value={form.shift} onValueChange={v => handleChange("shift", v)} disabled={isEdit}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('addLog.placeholders.shift', 'Select shift')} /></SelectTrigger>
                <SelectContent>
                  {Array.isArray(company?.shiftTimings)
                    ? (company.shiftTimings as { name: string; start?: string; end?: string }[]).map((shift, idx) => (
                        <SelectItem key={shift.name || idx} value={shift.name} className="text-sm">
                          {shift.name} {shift.start && shift.end ? `(${shift.start} - ${shift.end})` : ""}
                        </SelectItem>
                      ))
                    : []}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.noteType', 'Note Type')}</Label>
              <Select value={form.noteType} onValueChange={v => handleChange("noteType", v)} disabled={isEdit}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('addLog.placeholders.noteType', 'Select note type')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Observation" className="text-sm">{t('addLog.noteTypes.observation', 'Observation')}</SelectItem>
                  <SelectItem value="Breakdown" className="text-sm">{t('addLog.noteTypes.breakdown', 'Breakdown')}</SelectItem>
                  <SelectItem value="Setup" className="text-sm">{t('addLog.noteTypes.setup', 'Setup')}</SelectItem>
                  <SelectItem value="Quality" className="text-sm">{t('addLog.noteTypes.quality', 'Quality')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.severity', 'Severity')}</Label>
              <Slider min={1} max={5} step={1} value={[form.severity]} onValueChange={v => handleChange("severity", v[0])} className="flex-1 h-2" />
              <span className="text-xs ml-2">{form.severity}</span>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.description', 'Description')}</Label>
              <Textarea
                maxLength={500}
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
                placeholder={t('addLog.placeholders.description', 'Description')}
                className="min-h-12 text-sm bg-gray-50 border-gray-300 rounded"
              />
            </div>
          </div>
          {form.noteType === "Breakdown" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs mb-1 font-medium">{t('addLog.fields.downtimeStart', 'Downtime Start')}</Label>
                <Input type="datetime-local" value={form.downtimeStart} onChange={e => handleChange("downtimeStart", e.target.value)} required className="h-9 text-sm bg-gray-50 border-gray-300 rounded" disabled={isEdit} />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs mb-1 font-medium">{t('addLog.fields.downtimeEnd', 'Downtime End')}</Label>
                <Input type="datetime-local" value={form.downtimeEnd} onChange={e => handleChange("downtimeEnd", e.target.value)} className="h-9 text-sm bg-gray-50 border-gray-300 rounded" disabled={isEdit} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.status', 'Status')}</Label>
              <Select value={form.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('addLog.placeholders.status', 'Status')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open" className="text-sm">{t('addLog.status.open', 'Open')}</SelectItem>
                  <SelectItem value="Closed" className="text-sm">{t('addLog.status.closed', 'Closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1 font-medium">{t('addLog.fields.duration', 'Duration (min)')}</Label>
              <Input value={form.downtimeStart && form.downtimeEnd ? Math.max(0, Math.round((new Date(form.downtimeEnd).getTime() - new Date(form.downtimeStart).getTime()) / 60000)) : form.duration} disabled className="h-9 text-sm bg-gray-50 border-gray-300 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs mb-1 font-medium">
              {t('addLog.fields.media', 'Image/Video (max 12MB)')}
            </Label>
             <span className="block text-[11px] text-muted-foreground font-normal">{t('addLog.fields.mediaHelp', '( Supported: JPG, JPEG, PNG, WEBP, GIF, MP4, WEBM, MOV, AVI )')}</span>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/x-msvideo"
              onChange={handleFileChange}
              disabled={fileUploading || isEdit}
            />
            {cameraSupported && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setCameraMode("photo");
                    setCameraOpen(true);
                  }}
                  disabled={fileUploading || isEdit}
                >
                  {t('addLog.media.capturePhoto', 'Capture Photo')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setCameraMode("video");
                    setCameraOpen(true);
                  }}
                  disabled={fileUploading || isEdit}
                >
                  {t('addLog.media.recordVideo', 'Record Video')}
                </Button>
              </div>
            )}
            {fileUploading && <span className="text-xs text-primary">{t('common.uploading', 'Uploading...')}</span>}
            {filePreview && form.photo && form.photo.type.startsWith("image/") && (
              <img
                src={filePreview}
                alt="preview"
                className="h-24 mt-2 rounded border object-contain cursor-pointer"
                onClick={() => setPreviewOpen(true)}
              />
            )}
            {filePreview && form.photo && form.photo.type.startsWith("video/") && (
              <video
                src={filePreview}
                controls
                className="h-24 mt-2 rounded border object-contain cursor-pointer"
                onClick={() => setPreviewOpen(true)}
              />
            )}
            {form.fileUrl && !filePreview && form.photo && form.photo.type.startsWith("video/") && (
              <video
                src={form.fileUrl}
                controls
                className="h-24 mt-2 rounded border object-contain cursor-pointer"
                onClick={() => setPreviewOpen(true)}
              />
            )}
            {form.fileUrl && !form.photo && (form.fileUrl.endsWith('.mp4') || form.fileUrl.endsWith('.webm')) && (
              <video
                src={form.fileUrl}
                controls
                className="h-24 mt-2 rounded border object-contain cursor-pointer"
                onClick={() => setPreviewOpen(true)}
              />
            )}
            {form.fileUrl && !form.photo && (form.fileUrl.endsWith('.jpg') || form.fileUrl.endsWith('.jpeg') || form.fileUrl.endsWith('.png')) && (
              <img
                src={form.fileUrl}
                alt="uploaded"
                className="h-24 mt-2 rounded border object-contain cursor-pointer"
                onClick={() => setPreviewOpen(true)}
              />
            )}
            {/* File Preview Modal */}
            <PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <PreviewDialogContent className="flex flex-col items-center justify-center max-w-2xl w-full max-h-[90vh]">
                {(() => {
                  // Show image if available
                  if (filePreview && form.photo && form.photo.type.startsWith("image/")) {
                    return <img src={filePreview} alt="preview-large" className="max-h-[70vh] max-w-full rounded border object-contain" />;
                  }
                  if (filePreview && form.photo && form.photo.type.startsWith("video/")) {
                    return <video src={filePreview} controls autoPlay className="max-h-[70vh] max-w-full rounded border object-contain" />;
                  }
                  // Show video if available
                  if (form.fileUrl && ((form.photo && form.photo.type.startsWith("video/")) || form.fileUrl.endsWith('.mp4') || form.fileUrl.endsWith('.webm'))) {
                    return <video src={form.fileUrl} controls autoPlay className="max-h-[70vh] max-w-full rounded border object-contain" />;
                  }
                  // Show uploaded image if available
                  if (form.fileUrl && (form.fileUrl.endsWith('.jpg') || form.fileUrl.endsWith('.jpeg') || form.fileUrl.endsWith('.png'))) {
                    return <img src={form.fileUrl} alt="uploaded-large" className="max-h-[70vh] max-w-full rounded border object-contain" />;
                  }
                  return null;
                })()}
              </PreviewDialogContent>
            </PreviewDialog>
            <CameraDialog open={cameraOpen} onOpenChange={handleCameraOpenChange}>
              <CameraDialogContent className="sm:max-w-lg">
                <CameraDialogHeader>
                  <CameraDialogTitle>
                    {cameraMode === "photo"
                      ? t("addLog.media.dialogTitlePhoto", "Capture Photo")
                      : t("addLog.media.dialogTitleVideo", "Record Video")}
                  </CameraDialogTitle>
                  <CameraDialogDescription>
                    {cameraMode === "photo"
                      ? t("addLog.media.photoDescription", "Align your subject and capture a still image.")
                      : t("addLog.media.videoDescription", "Use the controls below to record a short clip.")}
                  </CameraDialogDescription>
                </CameraDialogHeader>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={cameraMode === "photo" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCameraMode("photo")}
                      disabled={cameraMode === "photo"}
                    >
                      {t("addLog.media.photoMode", "Photo")}
                    </Button>
                    <Button
                      type="button"
                      variant={cameraMode === "video" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCameraMode("video")}
                      disabled={cameraMode === "video"}
                    >
                      {t("addLog.media.videoMode", "Video")}
                    </Button>
                  </div>
                  <div className="aspect-video w-full rounded-lg bg-black/80 flex items-center justify-center overflow-hidden">
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
                      {t("addLog.media.initializing", "Initializing camera...")}
                    </p>
                  )}
                  {cameraMode === "video" && isRecording && (
                    <p className="text-xs text-red-500 text-center">
                      {t("addLog.media.recording", "Recording...")}
                    </p>
                  )}
                </div>
                <CameraDialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => handleCameraOpenChange(false)}>
                    {t("common.cancel", "Cancel")}
                  </Button>
                  {cameraMode === "photo" ? (
                    <Button
                      type="button"
                      onClick={handleCapturePhoto}
                      disabled={!!cameraError || cameraLoading}
                    >
                      {t("addLog.media.capturePhoto", "Capture Photo")}
                    </Button>
                  ) : isRecording ? (
                    <Button type="button" variant="destructive" onClick={() => stopRecording()}>
                      {t("addLog.media.stopRecording", "Stop Recording")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={startRecording}
                      disabled={!!cameraError || cameraLoading}
                    >
                      {t("addLog.media.startRecording", "Start Recording")}
                    </Button>
                  )}
                </CameraDialogFooter>
                <canvas ref={canvasRef} className="hidden" />
              </CameraDialogContent>
            </CameraDialog>
          </div>
          <div className="flex justify-end mt-2">
            <Button type="submit" className="w-full sm:w-auto h-9 px-6 text-sm font-medium bg-black text-white rounded" disabled={fileUploading}>
              {fileUploading ? t('common.uploading', 'Uploading...') : t('addLog.buttons.submit', 'Submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
