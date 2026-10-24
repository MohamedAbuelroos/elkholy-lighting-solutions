import styles from "./website-loading.module.css";

type WebsiteLoadingProps = {
  message?: string;
};

export function WebsiteLoading({
  message = "جارٍ تجهيز الصفحة…",
}: WebsiteLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={styles.root}
    >
      <div className={styles.content}>
        <div aria-hidden="true">
          <p dir="ltr" className={styles.brand}>
            ELKHOLY
          </p>

          <p dir="ltr" className={styles.subtitle}>
            LIGHTING SOLUTIONS
          </p>

          <div className={styles.track}>
            <span className={styles.light} />
          </div>
        </div>

        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
