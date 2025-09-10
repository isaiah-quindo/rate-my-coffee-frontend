import type { IStaticMethods } from "preline/dist";

declare global {
  interface Window {
    // Optional third-party libraries
    _: typeof import("lodash");
    $: typeof import("jquery");
    jQuery: typeof import("jquery");
    noUiSlider: any;
    DataTable: any;
    Dropzone: any;
    VanillaCalendarPro: typeof import("vanilla-calendar-pro");

    // Preline UI
    HSStaticMethods: IStaticMethods;

    // MailerLite
    ml: (action: string, ...args: any[]) => void;
  }
}

export {};