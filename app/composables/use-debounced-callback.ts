import { onBeforeUnmount } from "vue";

export const useDebouncedCallback = <TArgs extends unknown[]>(
  // eslint-disable-next-line no-unused-vars
  callback: (..._args: TArgs) => void,
  delay = 300,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const debounced = (...args: TArgs) => {
    cancel();
    timeoutId = setTimeout(() => {
      callback(...args);
      timeoutId = null;
    }, delay);
  };

  onBeforeUnmount(cancel);

  return { debounced, cancel };
};
