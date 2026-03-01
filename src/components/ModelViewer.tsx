import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Box, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import model-viewer types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "shadow-intensity"?: string;
          exposure?: string;
          "environment-image"?: string;
          "camera-orbit"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "field-of-view"?: string;
          loading?: "auto" | "lazy" | "eager";
        },
        HTMLElement
      >;
    }
  }
}

interface ModelViewerProps {
  modelUrl: string;
  alt: string;
  posterImage?: string;
}

const ModelViewer = ({ modelUrl, alt, posterImage }: ModelViewerProps) => {
  const viewerRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    // Load the model-viewer script if not already loaded
    if (!customElements.get("model-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      document.head.appendChild(script);
    }

    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
      console.log({ event: "model_load_success", modelUrl });
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      console.error({ event: "model_load_error", modelUrl });
    };

    const handleProgress = (event: any) => {
      const progress = event.detail?.totalProgress || 0;
      setLoadProgress(Math.round(progress * 100));
    };

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    viewer.addEventListener("progress", handleProgress);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
      viewer.removeEventListener("progress", handleProgress);
    };
  }, [modelUrl]);

  const resetCamera = () => {
    const viewer = viewerRef.current as any;
    if (viewer?.resetTurntableRotation) {
      viewer.resetTurntableRotation();
    }
  };

  if (hasError) {
    return (
      <div className="aspect-[16/10] rounded-xl viewer-container flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-muted-foreground mb-2">Failed to load 3D model</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setHasError(false);
            setIsLoading(true);
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] rounded-xl overflow-hidden viewer-container">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading 3D model...</p>
          <div className="w-32 h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Model Viewer */}
      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        alt={alt}
        poster={posterImage}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="0.8"
        camera-orbit="45deg 75deg 105%"
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 200%"
        loading="eager"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="glass"
          size="iconSm"
          onClick={resetCamera}
          className="bg-background/80 backdrop-blur-sm"
          title="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* 3D badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium">
        <Box className="w-4 h-4" />
        Interactive 3D
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom • Pinch on mobile
      </div>
    </div>
  );
};

export default ModelViewer;
