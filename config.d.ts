// custom.d.ts
interface Window {
    application: {
      status: () => string;
      close: () => void;
      minimized: () => void;
      maximize: () => void;
      minimizable: () => boolean;
      maximizable: () => boolean;
      isMaximizable: () => boolean;
    };
    node: {
      fs: typeof import('fs');
      path: typeof import('path');
      dialog: typeof import('@electron/remote').dialog;
      isDirectory: (param: string) => Promise<boolean>;
    };
  }
  