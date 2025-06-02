export type YandexMetrikaHitOptions = {
  callback: () => void;
  ctx: unknown;
  params: YandexMetrikaHitParams;
  referer: string;
  title: string;
};

export type YandexMetrikaHitParams = {
  order_price: number;
  currency: string;
};

export type YandexMetrikaMethod =
  | "init"
  | "hit"
  | "addFileExtension"
  | "extLink"
  | "file"
  | "firstPartyParams"
  | "firstPartyParamsHashed"
  | "getClientID"
  | "notBounce"
  | "params"
  | "reachGoal"
  | "setUserID"
  | "userParams";

declare const ym: (
  id: number,
  method: YandexMetrikaMethod,
  ...params: unknown[]
) => void;

const enabled = !!(process.env.NODE_ENV === "production");

const useYandexMetrika = (id: number) => {
  const hit = (url?: string, options?: YandexMetrikaHitOptions) => {
    if (enabled) {
      ym(id, "hit", url, options);
    } else {
      console.log(`%c[YandexMetrika](hit)`, `color: orange`, url);
    }
  };

  const reachGoal = (
    target: string,
    params?: unknown,
    callback?: () => void,
    ctx?: unknown,
  ) => {
    if (enabled) {
      ym(id, "reachGoal", target, params, callback, ctx);
    } else {
      console.log(`%c[YandexMetrika](reachGoal)`, `color: orange`, target);
    }
  };

  return { hit, reachGoal };
};

export default useYandexMetrika;
