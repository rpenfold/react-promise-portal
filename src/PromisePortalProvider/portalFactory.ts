import { ErrorInfo } from "react";
import {
  ComponentProps,
  Portal,
  PortalComponentType,
  PromiseComponentResult,
} from "types";
import generateSimpleUniqueId from "../utils/simpleUniqueId";
import { ProviderInternalContext } from "./types";

/**
 * Builds a portal that can be awaited.
 */
export const buildAwaitablePortal =
  <T>(
    resolve: (
      value: PromiseComponentResult<T> | PromiseLike<PromiseComponentResult<T>>
    ) => void,
    reject: (
      value: PromiseComponentResult<T> | PromiseLike<PromiseComponentResult<T>>
    ) => void
  ) =>
  (
    Component: PortalComponentType,
    props: ComponentProps,
    context: ProviderInternalContext
  ): Portal<T> => {
    const id = generateSimpleUniqueId();
    return {
      id,
      Component,
      open: true,
      props,
      forceShow: true,
      onCancel: (data?: T): void => {
        resolve({ cancelled: true, data });
        context.removePortal(id);
      },
      onComplete: (data?: T): void => {
        resolve({ cancelled: false, data });
        context.removePortal(id);
      },
      onError: (error: Error, errorInfo: ErrorInfo): void => {
        reject({ cancelled: false, error, errorInfo });
        context.removePortal(id);
      },
      onRequestClose: (): void => context.requestClosePortal(id),
    };
  };
