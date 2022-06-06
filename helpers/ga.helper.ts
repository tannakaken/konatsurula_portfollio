export const pageView = (title: string, path: string) => {
  if (process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
    gtag("config", process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, {
      page_title: title,
      page_path: path,
    });
  } else {
    console.log(
      "Tracking not enabled, as `trackingId` was not given and there is no `NEXT_PUBLIC_GA4_MEASUREMENT_ID`."
    );
  }
};

export const trackingEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
    gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.log(
      "Tracking not enabled, as `trackingId` was not given and there is no `NEXT_PUBLIC_GA4_MEASUREMENT_ID`."
    );
  }
};
