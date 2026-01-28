import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { defineComponent } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { useDebouncedCallback } from "../../app/composables/use-debounced-callback";
// eslint-disable-next-line no-unused-vars
const mountDebounced = async (callback: (..._args: string[]) => void, delay = 50) => {
  const component = defineComponent({
    setup() {
      const { debounced, cancel } = useDebouncedCallback(callback, delay);
      return { debounced, cancel };
    },
    template: "<div />",
  });

  return mountSuspended(component);
};

describe("use-debounced-callback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces calls and keeps the latest args", async () => {
    const callback = vi.fn();
    const wrapper = await mountDebounced(callback, 100);
    const vm = wrapper.vm as unknown as {
      // eslint-disable-next-line no-unused-vars
      debounced: (_: string) => void;
      cancel: () => void;
    };

    vm.debounced("first");
    vm.debounced("second");

    vi.advanceTimersByTime(99);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("cancels pending execution", async () => {
    const callback = vi.fn();
    const wrapper = await mountDebounced(callback, 100);
    const vm = wrapper.vm as unknown as {
      // eslint-disable-next-line no-unused-vars
      debounced: (_: string) => void;
      cancel: () => void;
    };

    vm.debounced("later");
    vm.cancel();

    vi.runAllTimers();
    expect(callback).not.toHaveBeenCalled();
  });

  it("cancels pending execution on unmount", async () => {
    const callback = vi.fn();
    const wrapper = await mountDebounced(callback, 100);
    const vm = wrapper.vm as unknown as {
      // eslint-disable-next-line no-unused-vars
      debounced: (_: string) => void;
      cancel: () => void;
    };

    vm.debounced("later");
    wrapper.unmount();

    vi.runAllTimers();
    expect(callback).not.toHaveBeenCalled();
  });
});
